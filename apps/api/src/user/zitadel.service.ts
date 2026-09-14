import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { OidcRole } from "@overbookd/oidc";
import { ApiZitadelUser } from "./entities/zitadel-api-user.entity";
import { ApiZitadelRoles } from "./entities/zitadel-api-roles.entity";
import { ApiZitadelUserCreated } from "./entities/zitadel-api-user-created.entity";
import { OverDate } from "@overbookd/time";
import { ApiZitadelMetadata } from "./entities/zitadel-api-metadata.entity";

type UserProfileForm = {
  givenName: string;
  familyName: string;
  nickName?: string;
};

type UpdateUserForm = {
  profile: UserProfileForm;
  phoneNumber: string;
  email: string;
};

type UserMetadataForm = {
  dateOfBirth: Date;
};

type CreateUserForm = UpdateUserForm &
  UserMetadataForm & {
    password: string;
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

  private readonly logger = new Logger(ZitadelService.name);

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

    const response = await this.safeFetch<{ result: ApiZitadelUser[] }>(
      `${this.ZITADEL_BASE_URL}/v2/users`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );
    return response.result?.at(0);
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

    const response = await this.safeFetch<{ result: ApiZitadelRoles[] }>(
      `${this.ZITADEL_BASE_URL}/management/v1/users/grants/_search`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );
    return response.result?.at(0);
  }

  updateZitadelRole(
    zitadelUserId: string,
    grantId: string,
    roleKeys: Array<OidcRole>,
  ) {
    const data = JSON.stringify({ roleKeys });
    return this.safeFetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants/${grantId}`,
      {
        method: "PUT",
        body: data,
        headers: this.headers,
      },
    );
  }

  addZitadelRole(
    zitadelUserId: string,
    roleKeys: Array<OidcRole>,
    projectId?: string,
  ) {
    const data = JSON.stringify({
      projectId: projectId ?? this.ZITADEL_OVERBOOKD_PROJECT_ID,
      roleKeys,
    });
    return this.safeFetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );
  }

  removeZitadelGrant(zitadelUserId: string, grantId: string) {
    return this.safeFetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/grants/${grantId}`,
      {
        method: "DELETE",
        headers: this.headers,
      },
    );
  }

  createZitadelUser(user: CreateUserForm): Promise<ApiZitadelUserCreated> {
    const metadata = this.buildMetadata({
      dateOfBirth: user.dateOfBirth,
    });

    const data = JSON.stringify({
      profile: {
        ...user.profile,
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

    return this.safeFetch(`${this.ZITADEL_BASE_URL}/v2/users/human`, {
      method: "POST",
      body: data,
      headers: this.headers,
    });
  }

  updateZitadelUser(
    zitadelUserId: string,
    form: Partial<UpdateUserForm & UserMetadataForm>,
  ) {
    const profilePromise =
      form.profile || form.email || form.phoneNumber
        ? this.updateProfile(zitadelUserId, form)
        : Promise.resolve();
    const metadataPromise = form.dateOfBirth
      ? this.updateMetadata(zitadelUserId, { dateOfBirth: form.dateOfBirth })
      : Promise.resolve();
    return Promise.all([profilePromise, metadataPromise]);
  }

  private updateProfile(zitadelUserId: string, form: Partial<UpdateUserForm>) {
    const profile = form.profile
      ? {
          profile: {
            ...form.profile,
            nickName: form.profile.nickName ?? "",
          },
        }
      : {};
    const email = form.email ? { email: { email: form.email } } : {};
    const phone = form.phoneNumber
      ? { phone: { phone: form.phoneNumber, isVerified: true } }
      : {};
    const reqBody = JSON.stringify({ ...profile, ...email, ...phone });

    return this.safeFetch(
      `${this.ZITADEL_BASE_URL}/v2/users/human/${zitadelUserId}`,
      {
        method: "PUT",
        body: reqBody,
        headers: this.headers,
      },
    );
  }

  private updateMetadata(zitadelUserId: string, metadata: UserMetadataForm) {
    const zitadelMetadata = this.buildMetadata(metadata);
    const data = JSON.stringify({ metadata: zitadelMetadata });
    return this.safeFetch(
      `${this.ZITADEL_BASE_URL}/management/v1/users/${zitadelUserId}/metadata/_bulk`,
      {
        method: "POST",
        body: data,
        headers: this.headers,
      },
    );
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

  private async safeFetch<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      return await this.handleZitadelResponse(response);
    } catch (error) {
      const errorMessage =
        "Erreur lors de la communication avec le service ZITADEL";
      this.logger.error(errorMessage, error);
      throw new HttpException(errorMessage, 500);
    }
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
