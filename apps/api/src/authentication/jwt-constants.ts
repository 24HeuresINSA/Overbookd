export const jwtConstants = {
  secret: (() => {
    const envSecret = process.env.JWT_SECRET;
    const nodEnv = process.env.NODE_ENV || "development";

    if (!envSecret && nodEnv === "production") {
      throw new Error("JWT_SECRET is required in production environment");
    }

    return envSecret || "devSecretKey";
  })(),
};
