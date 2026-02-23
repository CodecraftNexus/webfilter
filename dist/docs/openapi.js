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
                                            }
                                        }
                                    }
                                }
                            }
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
                                            }
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
                                    refreshToken: { type: "string" }
                                }
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
                                    }
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
                                            }
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
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "list_type",
                        in: "query",
                        schema: { type: "string", enum: ["white", "black"] },
                        description: "Filter by whitelist or blacklist (applies to both tables)",
                        example: "black"
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by type - partial match (applies to both tables)",
                        example: "Social Media"
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records from this datetime (ISO 8601)",
                        example: "2025-01-01T00:00:00.000Z"
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records up to this datetime (ISO 8601)",
                        example: "2025-12-31T23:59:59.000Z"
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 20 },
                        description: "Records per page (max 100)"
                    }
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
                                                                    updated_at: { type: "string", format: "date-time" }
                                                                }
                                                            }
                                                        },
                                                        total: { type: "integer", example: 25 }
                                                    }
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
                                                                    updated_at: { type: "string", format: "date-time" }
                                                                }
                                                            }
                                                        },
                                                        total: { type: "integer", example: 12 }
                                                    }
                                                }
                                            }
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/webfilter/api/webfilter": {
            get: {
                summary: "Get all web filter application records",
                description: "Logged-in user's web filter application records. Supports filters: list_type, type, application, datetime range, pagination.",
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "list_type",
                        in: "query",
                        schema: { type: "string", enum: ["white", "black"] },
                        description: "Filter by whitelist or blacklist",
                        example: "black"
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by type (partial match)",
                        example: "Social Media"
                    },
                    {
                        name: "application",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by application name (partial match)",
                        example: "Facebook"
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records from this datetime (ISO 8601)",
                        example: "2025-01-01T00:00:00.000Z"
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records up to this datetime (ISO 8601)",
                        example: "2025-12-31T23:59:59.000Z"
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 20 },
                        description: "Records per page (max 100)"
                    }
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
                                                    updated_at: { type: "string", format: "date-time" }
                                                }
                                            }
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" }
                }
            },
            post: {
                summary: "Create a new web filter application record",
                description: "Create a new web filter application entry linked to the logged-in user",
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["datetime", "application", "list_type", "type"],
                                properties: {
                                    datetime: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2025-06-15T10:30:00.000Z",
                                        description: "Date and time of the filter event (ISO 8601)"
                                    },
                                    application: {
                                        type: "string",
                                        example: "Facebook",
                                        description: "Application or website name"
                                    },
                                    list_type: {
                                        type: "string",
                                        enum: ["white", "black"],
                                        example: "black",
                                        description: "Whitelist or blacklist"
                                    },
                                    reason: {
                                        type: "string",
                                        example: "Social media distraction",
                                        nullable: true,
                                        description: "Reason for filtering (optional)"
                                    },
                                    type: {
                                        type: "string",
                                        example: "Social Media",
                                        description: "Category or type of the application"
                                    }
                                }
                            }
                        }
                    }
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/webfilter/api/webfilter/{id}": {
            get: {
                summary: "Get a single web filter application record by ID",
                description: "Returns a specific web filter application record belonging to the logged-in user",
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter record ID",
                        example: "WF-000001"
                    }
                ],
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            },
            put: {
                summary: "Update a web filter application record",
                description: "Update any fields of a web filter application record belonging to the logged-in user",
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter record ID",
                        example: "WF-000001"
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2025-06-16T08:00:00.000Z",
                                        description: "Updated datetime (optional)"
                                    },
                                    application: {
                                        type: "string",
                                        example: "YouTube",
                                        description: "Updated application name (optional)"
                                    },
                                    list_type: {
                                        type: "string",
                                        enum: ["white", "black"],
                                        example: "white",
                                        description: "Updated list type (optional)"
                                    },
                                    reason: {
                                        type: "string",
                                        nullable: true,
                                        example: "Updated reason",
                                        description: "Updated reason (optional)"
                                    },
                                    type: {
                                        type: "string",
                                        example: "Streaming",
                                        description: "Updated type (optional)"
                                    }
                                }
                            }
                        }
                    }
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            },
            delete: {
                summary: "Delete a web filter application record",
                description: "Delete a web filter application record belonging to the logged-in user",
                tags: ["Web Filter"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter record ID",
                        example: "WF-000001"
                    }
                ],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter record deleted successfully" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/webfilter/api/webfilter-link": {
            get: {
                summary: "Get all web filter link records",
                description: "Logged-in user's web filter link records. Supports filters: list_type, type, link, datetime range, pagination.",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "list_type",
                        in: "query",
                        schema: { type: "string", enum: ["white", "black"] },
                        description: "Filter by whitelist or blacklist",
                        example: "black"
                    },
                    {
                        name: "type",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by type (partial match)",
                        example: "Social Media"
                    },
                    {
                        name: "link",
                        in: "query",
                        schema: { type: "string" },
                        description: "Filter by link URL (partial match)",
                        example: "facebook.com"
                    },
                    {
                        name: "from",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records from this datetime (ISO 8601)",
                        example: "2025-01-01T00:00:00.000Z"
                    },
                    {
                        name: "to",
                        in: "query",
                        schema: { type: "string", format: "date-time" },
                        description: "Filter records up to this datetime (ISO 8601)",
                        example: "2025-12-31T23:59:59.000Z"
                    },
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                        description: "Page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", default: 20 },
                        description: "Records per page (max 100)"
                    }
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
                                                    updated_at: { type: "string", format: "date-time" }
                                                }
                                            }
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                total: { type: "integer", example: 50 },
                                                page: { type: "integer", example: 1 },
                                                limit: { type: "integer", example: 20 },
                                                totalPages: { type: "integer", example: 3 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" }
                }
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
                                    datetime: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2025-06-15T10:30:00.000Z",
                                        description: "Date and time of the filter event (ISO 8601)"
                                    },
                                    link: {
                                        type: "string",
                                        example: "https://www.facebook.com",
                                        description: "URL to filter"
                                    },
                                    list_type: {
                                        type: "string",
                                        enum: ["white", "black"],
                                        example: "black",
                                        description: "Whitelist or blacklist"
                                    },
                                    reason: {
                                        type: "string",
                                        example: "Social media distraction",
                                        nullable: true,
                                        description: "Reason for filtering (optional)"
                                    },
                                    type: {
                                        type: "string",
                                        example: "Social Media",
                                        description: "Category or type of the link"
                                    }
                                }
                            }
                        }
                    }
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "500": { description: "Server error" }
                }
            }
        },
        "/webfilter/api/webfilter-link/{id}": {
            get: {
                summary: "Get a single web filter link record by ID",
                description: "Returns a specific web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter link record ID",
                        example: "WFL-000001"
                    }
                ],
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            },
            put: {
                summary: "Update a web filter link record",
                description: "Update any fields of a web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter link record ID",
                        example: "WFL-000001"
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    datetime: {
                                        type: "string",
                                        format: "date-time",
                                        example: "2025-06-16T08:00:00.000Z",
                                        description: "Updated datetime (optional)"
                                    },
                                    link: {
                                        type: "string",
                                        example: "https://www.youtube.com",
                                        description: "Updated URL (optional)"
                                    },
                                    list_type: {
                                        type: "string",
                                        enum: ["white", "black"],
                                        example: "white",
                                        description: "Updated list type (optional)"
                                    },
                                    reason: {
                                        type: "string",
                                        nullable: true,
                                        example: "Updated reason",
                                        description: "Updated reason (optional)"
                                    },
                                    type: {
                                        type: "string",
                                        example: "Streaming",
                                        description: "Updated type (optional)"
                                    }
                                }
                            }
                        }
                    }
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
                                                updated_at: { type: "string", format: "date-time" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            },
            delete: {
                summary: "Delete a web filter link record",
                description: "Delete a web filter link record belonging to the logged-in user",
                tags: ["Web Filter Link"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        description: "Web filter link record ID",
                        example: "WFL-000001"
                    }
                ],
                responses: {
                    "200": {
                        description: "Record deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        message: { type: "string", example: "Web filter link record deleted successfully" }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Unauthorized" },
                    "404": { description: "Record not found" },
                    "500": { description: "Server error" }
                }
            }
        },
    },
};
