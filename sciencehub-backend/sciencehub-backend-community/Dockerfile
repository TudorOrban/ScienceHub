FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["sciencehub-backend-community/sciencehub-backend-community.csproj", "sciencehub-backend-community/"]
RUN dotnet restore "./sciencehub-backend-community/sciencehub-backend-community.csproj"
COPY . .
WORKDIR "/src/sciencehub-backend-community"
RUN dotnet build "./sciencehub-backend-community.csproj" -c "$BUILD_CONFIGURATION" -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./sciencehub-backend-community.csproj" -c "$BUILD_CONFIGURATION" -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "sciencehub-backend-community.dll"]