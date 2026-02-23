"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
const env_1 = require("../config/env");
const isDev = env_1.env.NODE_ENV !== "production";
exports.openApiSpec = {
    openapi: "3.1.0",
    info: {
        title: "Web filter API",
        version: "1.0.0",
        description: isDev
            ? "Development Mode → Login returns access_token & refresh_token in JSON. Copy access_token → click top-right 'Authorize' → paste → test everything!"
            : "Production Mode → Authentication via secure httpOnly cookies only (no tokens in response body).",
    },
    servers: [{ url: env_1.env.BASE_URL, description: "API Server" }],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Development only → paste access_token from /login response here",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", example: "42" },
                    name: { type: "string", example: "Kasun Perera" },
                    email: { type: "string", format: "email", example: "kasun@gmail.com" },
                    username: { type: "string", example: "kasun123" },
                    gender: { type: "string", nullable: true },
                    profileImage: { type: "string", nullable: true },
                },
            },
            Success: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                },
            },
            WebFilter: {
                type: "object",
                properties: {
                    id: { type: "string", example: "WF-000001" },
                    user_id: { type: "string", example: "USR-000001" },
                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                    application: { type: "string", example: "Facebook" },
                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                    type: { type: "string", example: "Social Media" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
            WebFilterLink: {
                type: "object",
                properties: {
                    id: { type: "string", example: "WFL-000001" },
                    user_id: { type: "string", example: "USR-000001" },
                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                    link: { type: "string", example: "https://www.facebook.com" },
                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                    type: { type: "string", example: "Social Media" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
            WebUsage: {
                type: "object",
                properties: {
                    id: { type: "string", example: "WU-000001" },
                    user_id: { type: "string", example: "USR-000001" },
                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                    weblink: { type: "string", example: "https://www.facebook.com" },
                    duration: { type: "integer", nullable: true, example: 3600, description: "Duration in seconds" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
            AppUsage: {
                type: "object",
                properties: {
                    id: { type: "string", example: "AU-000001" },
                    user_id: { type: "string", example: "USR-000001" },
                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                    application: { type: "string", example: "Instagram" },
                    duration: { type: "integer", nullable: true, example: 1800, description: "Duration in seconds" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
        },
    },
    security: [{ BearerAuth: [] }],
    paths: {
        "/webfilter/api/auth/register": {
            post: {
                summary: "Register new user",
                tags: ["Auth"],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fullName", "email", "password", "username"],
                                properties: {
                                    fullName: { type: "string", minLength: 2 },
                                    email: { type: "string", format: "email" },
                                    username: { type: "string", minLength: 3 },
                                    password: { type: "string", minLength: 8 },
                                },
                                example: {
                                    fullName: "Kasun Perera",
                                    email: "kasun@gmail.com",
                                    username: "kasun123",
                                    password: "mypassword123",
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User created",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                                username: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "409": { description: "Email or username taken" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/auth/login": {
            post: {
                summary: "Login with email and password",
                tags: ["Auth"],
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" },
                                },
                                example: { email: "kasun@gmail.com", password: "mypassword123" },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                            },
                                        },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Email and password are required" },
                    "401": { description: "Invalid email or password" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/auth/refresh": {
            post: {
                summary: "Refresh access token",
                tags: ["Auth"],
                security: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Token refreshed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        message: { type: "string" },
                                        access_token: { type: "string" },
                                        refresh_token: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Invalid or expired refresh token" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/profile": {
            get: {
                summary: "Get my profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Profile retrieved",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                        email: { type: "string" },
                                        username: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "404": { description: "User not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update profile",
                tags: ["Profile"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    gender: { type: "string", enum: ["Male", "Female", "Other"] },
                                    profileImage: { type: "string", description: "Base64 encoded image" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Profile updated",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string" },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                email: { type: "string" },
                                                username: { type: "string" },
                                                gender: { type: "string", nullable: true },
                                                profileImage: { type: "string", nullable: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "404": { description: "User not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/webfilter/all": {
            get: {
                summary: "Get all web filter records (Application + Link combined)",
                description: "Returns both web filter application records and web filter link records for the logged-in user in a single response.",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "list_type",
                        in: "query",
                        schema: { type: "string", enum: ["white", "black"] },
                        description: "Filter by whitelist or blacklist (applies to both tables)",
                        example: "black",
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by type - partial match (applies to both tables)",
                        example: "Social Media",
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records from this datetime (ISO 8601)",
                        example: "2025-01-01T00:00:00.000Z",
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records up to this datetime (ISO 8601)",
                        example: "2025-12-31T23:59:59.000Z",
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                        description: "Page number",
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 20 },
                        description: "Records per page (max 100)",
                    },
                ],
                responses: {
                    "200": {
                        description: "Combined application and link web filter records",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                applications: {
                                                    type: "object",
                                                    properties: {
                                                        records: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    id: { type: "string", example: "WF-000001" },
                                                                    user_id: { type: "string", example: "USR-000001" },
                                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                                    application: { type: "string", example: "Facebook" },
                                                                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                                    type: { type: "string", example: "Social Media" },
                                                                    source: { type: "string", example: "application" },
                                                                    created_at: { type: "string", format: "date-time" },
                                                                    updated_at: { type: "string", format: "date-time" },
                                                                },
                                                            },
                                                        },
                                                        total: { type: "integer", example: 25 },
                                                    },
                                                },
                                                links: {
                                                    type: "object",
                                                    properties: {
                                                        records: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    id: { type: "string", example: "WFL-000001" },
                                                                    user_id: { type: "string", example: "USR-000001" },
                                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                                    link: { type: "string", example: "https://www.facebook.com" },
                                                                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                                    type: { type: "string", example: "Social Media" },
                                                                    source: { type: "string", example: "link" },
                                                                    created_at: { type: "string", format: "date-time" },
                                                                    updated_at: { type: "string", format: "date-time" },
                                                                },
                                                            },
                                                        },
                                                        total: { type: "integer", example: 12 },
                                                    },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/webfilter": {
            get: {
                summary: "Get all web filter application records",
                description: "Logged-in user's web filter application records. Supports filters: list_type, type, application, datetime range, pagination.",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "list_type",
                        in: "query",
                        schema: { type: "string", enum: ["white", "black"] },
                        description: "Filter by whitelist or blacklist",
                        example: "black",
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by type (partial match)",
                        example: "Social Media",
                    },
                    {
                        name: "application",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by application name (partial match)",
                        example: "Facebook",
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records from this datetime (ISO 8601)",
                        example: "2025-01-01T00:00:00.000Z",
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records up to this datetime (ISO 8601)",
                        example: "2025-12-31T23:59:59.000Z",
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                        description: "Page number",
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 20 },
                        description: "Records per page (max 100)",
                    },
                ],
                responses: {
                    "200": {
                        description: "List of web filter application records",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string", example: "WF-000001" },
                                                    user_id: { type: "string", example: "USR-000001" },
                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                    application: { type: "string", example: "Facebook" },
                                                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                    type: { type: "string", example: "Social Media" },
                                                    created_at: { type: "string", format: "date-time" },
                                                    updated_at: { type: "string", format: "date-time" },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
            post: {
                summary: "Create a new web filter application record",
                description: "Create a new web filter application entry linked to the logged-in user",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["datetime", "application", "list_type", "type"],
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z", description: "Date and time of the filter event (ISO 8601)" },
                                    application: { type: "string", example: "Facebook", description: "Application or website name" },
                                    list_type: { type: "string", enum: ["white", "black"], example: "black", description: "Whitelist or blacklist" },
                                    reason: { type: "string", example: "Social media distraction", nullable: true, description: "Reason for filtering (optional)" },
                                    type: { type: "string", example: "Social Media", description: "Category or type of the application" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Record created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter record created successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WF-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                application: { type: "string", example: "Facebook" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                type: { type: "string", example: "Social Media" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/webfilter/{id}": {
            get: {
                summary: "Get a single web filter application record by ID",
                description: "Returns a specific web filter application record belonging to the logged-in user",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter record ID", example: "WF-000001" }],
                responses: {
                    "200": {
                        description: "Record found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WF-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                application: { type: "string", example: "Facebook" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                type: { type: "string", example: "Social Media" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update a web filter application record",
                description: "Update any fields of a web filter application record belonging to the logged-in user",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter record ID", example: "WF-000001" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z", description: "Updated datetime (optional)" },
                                    application: { type: "string", example: "YouTube", description: "Updated application name (optional)" },
                                    list_type: { type: "string", enum: ["white", "black"], example: "white", description: "Updated list type (optional)" },
                                    reason: { type: "string", nullable: true, example: "Updated reason", description: "Updated reason (optional)" },
                                    type: { type: "string", example: "Streaming", description: "Updated type (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Record updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter record updated successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WF-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z" },
                                                application: { type: "string", example: "YouTube" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "white" },
                                                reason: { type: "string", nullable: true, example: "Updated reason" },
                                                type: { type: "string", example: "Streaming" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            delete: {
                summary: "Delete a web filter application record",
                description: "Delete a web filter application record belonging to the logged-in user",
                tags: ["Web Filter Application"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter record ID", example: "WF-000001" }],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter record deleted successfully" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/webfilter-link": {
            get: {
                summary: "Get all web filter link records",
                description: "Logged-in user's web filter link records. Supports filters: list_type, type, link, datetime range, pagination.",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: "list_type", in: "query", schema: { type: "string", enum: ["white", "black"] }, description: "Filter by whitelist or blacklist", example: "black" },
                    { name: "type", in: "query", schema: { type: "string" }, description: "Filter by type (partial match)", example: "Social Media" },
                    { name: "link", in: "query", schema: { type: "string" }, description: "Filter by link URL (partial match)", example: "facebook.com" },
                    { name: "from", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter records from this datetime (ISO 8601)", example: "2025-01-01T00:00:00.000Z" },
                    { name: "to", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter records up to this datetime (ISO 8601)", example: "2025-12-31T23:59:59.000Z" },
                    { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Records per page (max 100)" },
                ],
                responses: {
                    "200": {
                        description: "List of web filter link records",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string", example: "WFL-000001" },
                                                    user_id: { type: "string", example: "USR-000001" },
                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                    link: { type: "string", example: "https://www.facebook.com" },
                                                    list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                    reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                    type: { type: "string", example: "Social Media" },
                                                    created_at: { type: "string", format: "date-time" },
                                                    updated_at: { type: "string", format: "date-time" },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
            post: {
                summary: "Create a new web filter link record",
                description: "Create a new web filter link entry linked to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["datetime", "link", "list_type", "type"],
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z", description: "Date and time of the filter event (ISO 8601)" },
                                    link: { type: "string", example: "https://www.facebook.com", description: "URL to filter" },
                                    list_type: { type: "string", enum: ["white", "black"], example: "black", description: "Whitelist or blacklist" },
                                    reason: { type: "string", example: "Social media distraction", nullable: true, description: "Reason for filtering (optional)" },
                                    type: { type: "string", example: "Social Media", description: "Category or type of the link" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Record created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter link record created successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WFL-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                link: { type: "string", example: "https://www.facebook.com" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                type: { type: "string", example: "Social Media" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/webfilter-link/{id}": {
            get: {
                summary: "Get a single web filter link record by ID",
                description: "Returns a specific web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter link record ID", example: "WFL-000001" }],
                responses: {
                    "200": {
                        description: "Record found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WFL-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                link: { type: "string", example: "https://www.facebook.com" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "black" },
                                                reason: { type: "string", nullable: true, example: "Social media distraction" },
                                                type: { type: "string", example: "Social Media" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update a web filter link record",
                description: "Update any fields of a web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter link record ID", example: "WFL-000001" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z", description: "Updated datetime (optional)" },
                                    link: { type: "string", example: "https://www.youtube.com", description: "Updated URL (optional)" },
                                    list_type: { type: "string", enum: ["white", "black"], example: "white", description: "Updated list type (optional)" },
                                    reason: { type: "string", nullable: true, example: "Updated reason", description: "Updated reason (optional)" },
                                    type: { type: "string", example: "Streaming", description: "Updated type (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Record updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter link record updated successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WFL-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z" },
                                                link: { type: "string", example: "https://www.youtube.com" },
                                                list_type: { type: "string", enum: ["white", "black"], example: "white" },
                                                reason: { type: "string", nullable: true, example: "Updated reason" },
                                                type: { type: "string", example: "Streaming" },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            delete: {
                summary: "Delete a web filter link record",
                description: "Delete a web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web filter link record ID", example: "WFL-000001" }],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter link record deleted successfully" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/web-usage/history": {
            get: {
                summary: "Get web + app usage history (combined)",
                description: "Returns web usage and app usage grouped by site/app with total duration and visit count. Filter by period or custom date range.",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "period",
                        in: "query",
                        schema: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"], default: "daily" },
                        description: "Time period to filter by. Ignored if from/to are provided.",
                        example: "weekly",
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Custom start datetime (ISO 8601). Overrides period.",
                        example: "2025-06-01T00:00:00.000Z",
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Custom end datetime (ISO 8601). Overrides period.",
                        example: "2025-06-30T23:59:59.000Z",
                    },
                ],
                responses: {
                    "200": {
                        description: "Usage history with grouped summary",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        period: { type: "string", example: "weekly" },
                                        date_range: {
                                            type: "object",
                                            properties: {
                                                from: { type: "string", format: "date-time", example: "2025-06-09T00:00:00.000Z" },
                                                to: { type: "string", format: "date-time", example: "2025-06-15T23:59:59.999Z" },
                                            },
                                        },
                                        summary: {
                                            type: "object",
                                            properties: {
                                                total_web_duration: { type: "integer", example: 7320, description: "Total seconds on web" },
                                                total_web_duration_formatted: { type: "string", example: "2h 2m" },
                                                total_web_visits: { type: "integer", example: 18 },
                                                total_app_duration: { type: "integer", example: 3600, description: "Total seconds on apps" },
                                                total_app_duration_formatted: { type: "string", example: "1h" },
                                                total_app_opens: { type: "integer", example: 9 },
                                            },
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                web: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            weblink: { type: "string", example: "https://www.facebook.com" },
                                                            visit_count: { type: "integer", example: 5 },
                                                            total_duration: { type: "integer", example: 3600 },
                                                            total_duration_formatted: { type: "string", example: "1h" },
                                                            records: { type: "array", items: { type: "object" } },
                                                        },
                                                    },
                                                },
                                                applications: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            application: { type: "string", example: "Instagram" },
                                                            open_count: { type: "integer", example: 3 },
                                                            total_duration: { type: "integer", example: 1800 },
                                                            total_duration_formatted: { type: "string", example: "30m" },
                                                            records: { type: "array", items: { type: "object" } },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Invalid period value" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/web-usage": {
            get: {
                summary: "Get all web usage records",
                description: "Logged-in user's web usage records. Supports filters: weblink, datetime range, pagination.",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: "weblink", in: "query", schema: { type: "string" }, description: "Filter by weblink (partial match)", example: "facebook.com" },
                    { name: "from", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter from this datetime", example: "2025-01-01T00:00:00.000Z" },
                    { name: "to", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter up to this datetime", example: "2025-12-31T23:59:59.000Z" },
                    { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Records per page (max 100)" },
                ],
                responses: {
                    "200": {
                        description: "List of web usage records",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string", example: "WU-000001" },
                                                    user_id: { type: "string", example: "USR-000001" },
                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                    weblink: { type: "string", example: "https://www.facebook.com" },
                                                    duration: { type: "integer", nullable: true, example: 3600 },
                                                    created_at: { type: "string", format: "date-time" },
                                                    updated_at: { type: "string", format: "date-time" },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
            post: {
                summary: "Create a new web usage record",
                description: "Log a new web usage entry for the logged-in user",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["datetime", "weblink"],
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z", description: "Date and time of usage (ISO 8601)" },
                                    weblink: { type: "string", example: "https://www.facebook.com", description: "URL visited" },
                                    duration: { type: "integer", example: 3600, nullable: true, description: "Duration in seconds (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Record created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web usage record created successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                weblink: { type: "string", example: "https://www.facebook.com" },
                                                duration: { type: "integer", nullable: true, example: 3600 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/web-usage/{id}": {
            get: {
                summary: "Get a single web usage record by ID",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web usage record ID", example: "WU-000001" }],
                responses: {
                    "200": {
                        description: "Record found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time" },
                                                weblink: { type: "string", example: "https://www.facebook.com" },
                                                duration: { type: "integer", nullable: true, example: 3600 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update a web usage record",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web usage record ID", example: "WU-000001" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z", description: "Updated datetime (optional)" },
                                    weblink: { type: "string", example: "https://www.youtube.com", description: "Updated URL (optional)" },
                                    duration: { type: "integer", nullable: true, example: 1800, description: "Updated duration in seconds (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Record updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web usage record updated successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "WU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time" },
                                                weblink: { type: "string", example: "https://www.youtube.com" },
                                                duration: { type: "integer", nullable: true, example: 1800 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            delete: {
                summary: "Delete a web usage record",
                tags: ["Web Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Web usage record ID", example: "WU-000001" }],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web usage record deleted successfully" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/app-usage": {
            get: {
                summary: "Get all app usage records",
                description: "Logged-in user's app usage records. Supports filters: application, datetime range, pagination.",
                tags: ["App Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: "application", in: "query", schema: { type: "string" }, description: "Filter by application name (partial match)", example: "Instagram" },
                    { name: "from", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter from this datetime", example: "2025-01-01T00:00:00.000Z" },
                    { name: "to", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter up to this datetime", example: "2025-12-31T23:59:59.000Z" },
                    { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Records per page (max 100)" },
                ],
                responses: {
                    "200": {
                        description: "List of app usage records",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string", example: "AU-000001" },
                                                    user_id: { type: "string", example: "USR-000001" },
                                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                    application: { type: "string", example: "Instagram" },
                                                    duration: { type: "integer", nullable: true, example: 1800 },
                                                    created_at: { type: "string", format: "date-time" },
                                                    updated_at: { type: "string", format: "date-time" },
                                                },
                                            },
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
            post: {
                summary: "Create a new app usage record",
                description: "Log a new app usage entry for the logged-in user",
                tags: ["App Usage"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["datetime", "application"],
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z", description: "Date and time of usage (ISO 8601)" },
                                    application: { type: "string", example: "Instagram", description: "Application name" },
                                    duration: { type: "integer", example: 1800, nullable: true, description: "Duration in seconds (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Record created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "App usage record created successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "AU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time", example: "2025-06-15T10:30:00.000Z" },
                                                application: { type: "string", example: "Instagram" },
                                                duration: { type: "integer", nullable: true, example: 1800 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" },
                },
            },
        },
        "/webfilter/api/app-usage/{id}": {
            get: {
                summary: "Get a single app usage record by ID",
                tags: ["App Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "App usage record ID", example: "AU-000001" }],
                responses: {
                    "200": {
                        description: "Record found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "AU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time" },
                                                application: { type: "string", example: "Instagram" },
                                                duration: { type: "integer", nullable: true, example: 1800 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            put: {
                summary: "Update an app usage record",
                tags: ["App Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "App usage record ID", example: "AU-000001" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: { type: "string", format: "date-time", example: "2025-06-16T08:00:00.000Z", description: "Updated datetime (optional)" },
                                    application: { type: "string", example: "TikTok", description: "Updated application name (optional)" },
                                    duration: { type: "integer", nullable: true, example: 2400, description: "Updated duration in seconds (optional)" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Record updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "App usage record updated successfully" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string", example: "AU-000001" },
                                                user_id: { type: "string", example: "USR-000001" },
                                                datetime: { type: "string", format: "date-time" },
                                                application: { type: "string", example: "TikTok" },
                                                duration: { type: "integer", nullable: true, example: 2400 },
                                                created_at: { type: "string", format: "date-time" },
                                                updated_at: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
            delete: {
                summary: "Delete an app usage record",
                tags: ["App Usage"],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "App usage record ID", example: "AU-000001" }],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "App usage record deleted successfully" },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" },
                },
            },
        },
    },
};
