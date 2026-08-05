import { apiFetch } from "~/utils/http/api-fetch";
import { DEFAULT_OPTIONS } from "~/utils/http/http-client";

export class ZitadelRepository {
  static updateProfilePicture(profilePicture: FormData) {
    const config = useRuntimeConfig();
    const baseUrl = config.public.zitadelBaseURL;
    const url = new URL(`${baseUrl}/assets/v1/users/me/avatar`);
    return apiFetch<void>(
      { url, method: "POST" },
      { ...DEFAULT_OPTIONS, acceptedType: undefined },
      profilePicture,
    );
  }
}
