# Use multi-stage builds to keep the final image clean and secure
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080 8081

# Create a non-root user for better security
RUN id app || adduser --disabled-password --gecos "" app
USER app

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj file first to leverage Docker cache
COPY ["sciencehub-backend-core/sciencehub-backend-core.csproj", "./sciencehub-backend-core/"]
RUN dotnet restore "sciencehub-backend-core/sciencehub-backend-core.csproj"

# Copy the rest of the source files
COPY sciencehub-backend-core/ ./sciencehub-backend-core/

WORKDIR "/src/sciencehub-backend-core"
RUN dotnet build "sciencehub-backend-core.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "sciencehub-backend-core.csproj" -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "sciencehub-backend-core.dll"]