import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { OidcRole } from "@overbookd/oidc";
import { ApiZitadelUser } from "./entities/zitadel-api-user.entity";
import { ApiZitadelRoles } from "./entities/zitadel-api-roles.entity";
import { ApiZitadelUserCreated } from "./entities/zitadel-api-user-created.entity";
import { OverDate } from "@overbookd/time";
import { ApiZitadelMetadata } from "./entities/zitadel-api-metadata.entity";

type UpdateUserProfileForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type CreateUserForm = UpdateUserProfileForm & {
  email: string;
  password: string;
  dateOfBirth: Date;
};

type UserMetadataForm = {
  dateOfBirth: Date;
};

@Injectable()
export class ZitadelService {
  private ZITADEL_BASE_URL = process.env.ZITADEL_BASE_URL;
  private ZITADEL_API_BEARER_TOKEN = process.env.ZITADEL_API_BEARER_TOKEN;
  private ZITADEL_OVERBOOKD_PROJECT_ID =
    process.env.ZITADEL_OVERBOOKD_PROJECT_ID;

  private headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${this.ZITADEL_API_BEARER_TOKEN}`,
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
      method: "POST",
      body: data,
      headers: this.headers,
    });

    return (await this.handleZitadelResponse(response)).result?.at(0);
  }

  async getZitadelUserById(zitadelUserId: string): Promise<ApiZitadelUser> {
    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/v2/users/${zitadelUserId}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );

    return (await this.handleZitadelResponse(response)).user;
  }

  async getZitadelRoles(
    zitadelUserId: string,
    projectId?: string,
  ): Promise<ApiZitadelRoles> {
    const data = JSON.stringify({
      query: {
        offset: "0",
        limit: 1,
        asc: true,
      },
      queries: [
        {
          projectIdQuery: {
            projectId: projectId ?? this.ZITADEL_OVERBOOKD_PROJECT_ID,
          },
        },
        { userIdQuery: { userId: zitadelUserId } },
      ],
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/grants/_search`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );

    return (await this.handleZitadelResponse(response)).result?.at(0);
  }

  async updateZitadelRole(
    zitadelUserId: string,
    grantId: string,
    roleKeys: Array<OidcRole>,
  ) {
    const data = JSON.stringify({ roleKeys });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants/${grantId}`,
      {
        method: "PUT",
        body: data,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async addZitadelRole(
    zitadelUserId: string,
    roleKeys: Array<OidcRole>,
    projectId?: string,
  ) {
    const data = JSON.stringify({
      projectId: projectId ?? this.ZITADEL_OVERBOOKD_PROJECT_ID,
      roleKeys,
    });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async removeZitadelGrant(zitadelUserId: string, grantId: string) {
    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants/${grantId}`,
      {
        method: "DELETE",
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async updateZitadelUser(
    zitadelUserId: string,
    form: Partial<UpdateUserProfileForm>,
  ): Promise<ApiZitadelUserCreated> {
    const shouldUpdateProfile = form.firstName || form.lastName;
    const givenName = form.firstName ? { givenName: form.firstName } : {};
    const familyName = form.lastName ? { familyName: form.lastName } : {};
    const profile = shouldUpdateProfile
      ? { profile: { ...givenName, ...familyName } }
      : {};
    const phone = form.phoneNumber
      ? { phone: { phone: form.phoneNumber, isVerified: true } }
      : {};
    const reqBody = JSON.stringify({ ...profile, ...phone });

    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/v2/users/human/${zitadelUserId}`,
      {
        method: "PUT",
        body: reqBody,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async createZitadelUser(
    user: CreateUserForm,
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
      method: "POST",
      body: data,
      headers: this.headers,
    });

    return await this.handleZitadelResponse(response);
  }

  async updateMetadata(zitadelUserId: string, metadata: UserMetadataForm) {
    const zitadelMetadata = this.buildMetadata(metadata);
    const data = JSON.stringify({ metadata: zitadelMetadata });
    const response = await fetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/metadata/_bulk`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );

    return await this.handleZitadelResponse(response);
  }

  async addZitadelRoleIfNotGranted(
    zitadelUserId: string,
    role: OidcRole,
    projectId?: string,
  ): Promise<void> {
    const userRoles = await this.getZitadelRoles(zitadelUserId, projectId);

    if (!userRoles) {
      await this.addZitadelRole(zitadelUserId, [role], projectId);
    } else if (!userRoles.roleKeys?.includes(role)) {
      await this.updateZitadelRole(zitadelUserId, userRoles.id, [
        ...(userRoles.roleKeys ?? []),
        role,
      ]);
    }
  }

  async removeZitadelRoleIfGranted(
    zitadelUserId: string,
    role: OidcRole,
    projectId?: string,
  ): Promise<void> {
    const userRoles = await this.getZitadelRoles(zitadelUserId, projectId);

    if (!userRoles || !userRoles.roleKeys?.includes(role)) return;

    if (userRoles.roleKeys.length > 1) {
      const newRoles = userRoles.roleKeys.filter((roleKey) => roleKey !== role);
      await this.updateZitadelRole(zitadelUserId, userRoles.id, newRoles);
    } else {
      await this.removeZitadelGrant(zitadelUserId, userRoles.id);
    }
  }

  private buildMetadata({
    dateOfBirth,
  }: UserMetadataForm): ApiZitadelMetadata[] {
    const metadata = [];
    metadata.push({
      key: "dateOfBirth",
      value: btoa(OverDate.from(dateOfBirth).dateString),
    });
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
