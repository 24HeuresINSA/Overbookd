import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { OidcRole } from "@overbookd/oidc";
import { ApiZitadelUser } from "./entities/zitadel-api-user.entity";
import { ApiZitadelRoles } from "./entities/zitade-api-roles.entity";
import { ApiZitadelUserCreated } from "./entities/zitadel-api-user-created.entity";
import { DateString, toIsoDate } from "@overbookd/time";
import { UserMetadata } from "./entities/user-metadata.entity";
import { ApiZitadelMetadata } from "./entities/zitadel-api-metadata.entity";

type AboutUser = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: DateString;
};

@Injectable()
export class ZitadelService {
  private ZITADEL_BASE_URL = process.env.ZITADEL_BASE_URL;
  private ZITADEL_API_BEARER_TOKEN = process.env.ZITADEL_API_BEARER_TOKEN;
  private ZITADEL_OVERRUN_PROJECT_ID = process.env.ZITADEL_OVERRUN_PROJECT_ID;

  private headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + this.ZITADEL_API_BEARER_TOKEN,
  };

  async getZitadelUserByEmail(userEmail: string): Promise<ApiZitadelUser> {
    const data = JSON.stringify({
      query: {
        offset: "0",
        limit: 1,
        asc: true,
      },
      sortingColumn: "USER_FIELD_NAME_EMAIL",
      queries: [
        {
          emailQuery: {
            emailAddress: userEmail,
            method: "TEXT_QUERY_METHOD_EQUALS",
          },
        },
      ],
    });

    const response = await fetch(`${this.ZITADEL_BASE_URL}/v2/users`, {
      method: "post",
      body: data,
      headers: this.headers,
    });

    return (await this.handleZitadelResponse(response)).result?.at(0);
  }

  async getZitadelUserById(zitadelUserId: string): Promise<ApiZitadelUser> {
    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/v2/users/${zitadelUserId}`,
      {
        method: "get",
        headers: this.headers,
      },
    );

    return (await this.handleZitadelResponse(response)).user;
  }

  async getZitadelRoles(userId: string): Promise<ApiZitadelRoles> {
    const data = JSON.stringify({
      query: {
        offset: "0",
        limit: 1,
        asc: true,
      },
      queries: [
        {
          projectIdQuery: {
            projectId: this.ZITADEL_OVERRUN_PROJECT_ID,
          },
        },
        {
          userIdQuery: {
            userId,
          },
        },
      ],
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/grants/_search`,
      {
        method: "post",
        body: data,
        headers: this.headers,
      },
    );

    return (await this.handleZitadelResponse(response)).result?.at(0);
  }

  async updateZitadelRole({
    userId,
    grantId,
    roleKeys,
  }: {
    userId: string;
    grantId: string;
    roleKeys: Array<OidcRole>;
  }) {
    const data = JSON.stringify({
      roleKeys,
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${userId}/grants/${grantId}`,
      {
        method: "put",
        body: data,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async addZitadelRole({
    userId,
    roleKeys,
  }: {
    userId: string;
    roleKeys: Array<OidcRole>;
  }) {
    const data = JSON.stringify({
      projectId: this.ZITADEL_OVERRUN_PROJECT_ID,
      roleKeys,
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${userId}/grants`,
      {
        method: "post",
        body: data,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async updateZitadelUser(
    zitadelId: string,
    dto: AboutUser,
  ): Promise<ApiZitadelUserCreated> {
    const reqBody = JSON.stringify({
      profile: {
        givenName: dto.firstName,
        familyName: dto.lastName,
      },
      phone: {
        phone: dto.phoneNumber,
        isVerified: true,
      },
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/v2/users/human/${zitadelId}`,
      {
        method: "put",
        body: reqBody,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async createZidatelUser(
    user: AboutUser & { password: string; email: string },
  ): Promise<ApiZitadelUserCreated> {
    const metadata = this.buildMetadata({
      dateOfBirth: user.dateOfBirth,
    });

    const data = JSON.stringify({
      profile: {
        givenName: user.firstName,
        familyName: user.lastName,
        preferredLanguage: "fr",
      },
      email: {
        email: user.email,
      },
      phone: {
        phone: user.phoneNumber,
        isVerified: true,
      },
      metadata,
      password: {
        password: user.password,
        changeRequired: false,
      },
    });

    const response = await fetch(`${this.ZITADEL_BASE_URL}/v2/users/human`, {
      method: "post",
      body: data,
      headers: this.headers,
    });

    return await this.handleZitadelResponse(response);
  }

  async updateMetadata(zitadelId: string, metadata: UserMetadata) {
    const zitadelMetadata = this.buildMetadata(metadata);
    if (zitadelMetadata.length > 0) {
      const data = JSON.stringify({ metadata: zitadelMetadata });
      const response = await fetch(
        `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelId}/metadata/_bulk`,
        {
          method: "post",
          body: data,
          headers: this.headers,
        },
      );

      return await this.handleZitadelResponse(response);
    }
  }

  async addZitadelRoleIfNotExist(
    zitadelUserId: string,
    role: OidcRole,
  ): Promise<void> {
    const userRoles = await this.getZitadelRoles(zitadelUserId);

    if (!userRoles) {
      await this.addZitadelRole({
        userId: zitadelUserId,
        roleKeys: [role],
      });
    } else if (!userRoles.roleKeys.includes(role)) {
      await this.updateZitadelRole({
        userId: zitadelUserId,
        grantId: userRoles.id,
        roleKeys: [...userRoles.roleKeys, role],
      });
    }
  }

  private buildMetadata({ dateOfBirth }: UserMetadata): ApiZitadelMetadata[] {
    const metadata = [];

    if (dateOfBirth) {
      metadata.push({
        key: "dateOfBirth",
        value: btoa(toIsoDate(dateOfBirth, { hideTime: true })),
      });
    }

    return metadata;
  }

  private async handleZitadelResponse(response: Response) {
    const body = await response.json();
    if (response.status === 400) throw new BadRequestException(body.message);
    if (response.status === 409) throw new ConflictException(body.message);
    if (response.status >= 400)
      throw new HttpException(body.message, response.status);
    return body;
  }
}
