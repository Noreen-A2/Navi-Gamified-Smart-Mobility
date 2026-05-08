from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "dev"
    cors_origins: str = "*"
    supabase_url: str = ""
    supabase_service_key: str = ""
    use_mock_data: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
