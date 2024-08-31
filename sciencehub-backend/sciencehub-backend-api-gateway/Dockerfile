FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8083

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["sciencehub-backend-api-gateway/sciencehub-backend-api-gateway.csproj", "sciencehub-backend-api-gateway/"]
RUN dotnet restore "./sciencehub-backend-api-gateway/sciencehub-backend-api-gateway.csproj"
COPY . .
WORKDIR "/src/sciencehub-backend-api-gateway"
RUN dotnet build "./sciencehub-backend-api-gateway.csproj" -c "$BUILD_CONFIGURATION" -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./sciencehub-backend-api-gateway.csproj" -c "$BUILD_CONFIGURATION" -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "sciencehub-backend-api-gateway.dll"]