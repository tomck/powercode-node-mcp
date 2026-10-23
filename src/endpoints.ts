// Generated from the server's /docs/openapi.json (Powercode UAPI V26.10.05). GET endpoints only.
// Entries with `restricted` are callable through call_api only with POWERCODE_YOLO=YOLO.
export interface EndpointParam { name: string; type: "string" | "number" | "boolean" | "array"; required: boolean; description: string }
export interface Endpoint { path: string; summary: string; params: EndpointParam[]; restricted?: string }
export const specVersion = "V26.10.05";
export const endpoints: Endpoint[] = [
  {
    "path": "/ai/explainAlert",
    "summary": "Explain an equipment's current state and recent event log in plain language, with recommended next steps.",
    "params": [
      {
        "name": "equipmentID",
        "type": "number",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/feedback",
    "summary": "Record optional, non-blocking feedback (rating and/or edit-delta) for one AI call.",
    "params": [
      {
        "name": "usageLogId",
        "type": "number",
        "required": true,
        "description": ""
      },
      {
        "name": "rating",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "generatedText",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "finalText",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "comment",
        "type": "string",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/geminiModels",
    "summary": "List Gemini models supporting generateContent for an API key.",
    "params": [
      {
        "name": "geminiApiKey",
        "type": "string",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/improveText",
    "summary": "Rewrite the contents of a rich-text editor (and optional subject) for a chosen action.",
    "params": [
      {
        "name": "action",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "content",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "subject",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "language",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "format",
        "type": "string",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/providerModels",
    "summary": "List currently available chat models for an AI provider.",
    "params": [
      {
        "name": "provider",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "apiKey",
        "type": "string",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/reportGenerate",
    "summary": "Generate a custom report (SQL + results) from a natural-language prompt, grounded in the live schema and existing reports.",
    "params": [
      {
        "name": "prompt",
        "type": "string",
        "required": true,
        "description": "Plain-English report request"
      },
      {
        "name": "baseSql",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "buildingBlockIds",
        "type": "array",
        "required": false,
        "description": "CustomReportIDs to compose as CTE building blocks"
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/reportRun",
    "summary": "Validate and run a read-only report query (manual SQL edits / re-runs from the AI report builder). No AI call.",
    "params": [
      {
        "name": "sql",
        "type": "string",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/ticketNextSteps",
    "summary": "Produce a bulleted list of concrete next actions for a support agent on this ticket.",
    "params": [
      {
        "name": "ticketID",
        "type": "number",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/ticketSuggestReply",
    "summary": "Draft a customer-facing reply for a TroubleTicket using the calling user's AI provider.",
    "params": [
      {
        "name": "ticketID",
        "type": "number",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/ai/ticketSummarize",
    "summary": "Generate an AI-generated summary of a TroubleTicket using the calling user's configured provider.",
    "params": [
      {
        "name": "ticketID",
        "type": "number",
        "required": true,
        "description": "TicketID to summarize"
      }
    ],
    "restricted": "AI endpoint: sends ticket or report content to the configured AI provider"
  },
  {
    "path": "/configure/allWebHookDestinations",
    "summary": "Get all WebHook Destinations",
    "params": []
  },
  {
    "path": "/configure/allWebHookEventOptionClasses",
    "summary": "Get all WebHook Event Option Classes",
    "params": []
  },
  {
    "path": "/configure/allWebHookEvents",
    "summary": "Get all WebHook Events",
    "params": []
  },
  {
    "path": "/configure/cdrBatch",
    "summary": "Get Cdr Batches",
    "params": []
  },
  {
    "path": "/configure/customDataField",
    "summary": "Get a custom Data Field by ID",
    "params": [
      {
        "name": "customDataFieldId",
        "type": "number",
        "required": true,
        "description": "ID of custom Data Field"
      }
    ]
  },
  {
    "path": "/configure/customDataFieldOption",
    "summary": "Get a custom Data Field Option by ID",
    "params": [
      {
        "name": "customDataFieldOptionId",
        "type": "number",
        "required": true,
        "description": "ID of custom Data Field Option"
      }
    ]
  },
  {
    "path": "/configure/customInfoOptions",
    "summary": "Get custom info options for a template",
    "params": [
      {
        "name": "customInfoTemplateId",
        "type": "number",
        "required": true,
        "description": "ID of the custom info template"
      }
    ]
  },
  {
    "path": "/configure/customInfoTemplateHeader",
    "summary": "Get headers for organizing custom fields by page",
    "params": [
      {
        "name": "page",
        "type": "string",
        "required": true,
        "description": "Page type"
      },
      {
        "name": "accountTypeId",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/configure/customInfoTemplates",
    "summary": "Get all custom info templates for a specific page type",
    "params": [
      {
        "name": "page",
        "type": "string",
        "required": false,
        "description": "Page type to filter by"
      },
      {
        "name": "accountTypeId",
        "type": "number",
        "required": false,
        "description": "Account Type ID"
      },
      {
        "name": "headerId",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/configure/emailSendEvent",
    "summary": "Get email send events",
    "params": []
  },
  {
    "path": "/configure/holidayCutoff",
    "summary": "Get holiday cutoffs",
    "params": [
      {
        "name": "ID",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/configure/nextWelcomeWizardStep",
    "summary": "Get the next uncompleted wizard step with the highest step number",
    "params": [],
    "restricted": "setup wizard state"
  },
  {
    "path": "/configure/notificationTemplate",
    "summary": "Get a Notification Template by ID or list all",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "ID of the Notification Template to get"
      }
    ]
  },
  {
    "path": "/configure/supportEmailBlacklist",
    "summary": "Get a Support Email Blacklist entry by ID, or list all entries",
    "params": [
      {
        "name": "blacklistID",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/configure/validateSaml",
    "summary": "Validate SAML Metadata Provider.",
    "params": [
      {
        "name": "idp",
        "type": "number",
        "required": true,
        "description": "Provider idp"
      }
    ],
    "restricted": "SAML metadata validation"
  },
  {
    "path": "/configure/webHookEventOptions",
    "summary": "Get WebHook event options by option class",
    "params": [
      {
        "name": "optionClass",
        "type": "string",
        "required": true,
        "description": "Option class to filter by"
      }
    ]
  },
  {
    "path": "/configure/webHooks",
    "summary": "Get a WebHook Destination by ID, or list all destinations",
    "params": [
      {
        "name": "destinationID",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/configure/welcomeWizardStepCompleted",
    "summary": "Check if a wizard step is already completed",
    "params": [
      {
        "name": "wizardStep",
        "type": "number",
        "required": true,
        "description": "Wizard step number to check"
      }
    ],
    "restricted": "setup wizard state"
  },
  {
    "path": "/customer/billing/credit",
    "summary": "Get customer credits",
    "params": [
      {
        "name": "creditId",
        "type": "number",
        "required": false,
        "description": "ID of the Credit"
      },
      {
        "name": "customerId",
        "type": "number",
        "required": false,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/billing/debit",
    "summary": "Get customer debits",
    "params": [
      {
        "name": "debitId",
        "type": "number",
        "required": false,
        "description": "ID of the Debit"
      },
      {
        "name": "customerId",
        "type": "number",
        "required": false,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/billing/invoicePreference",
    "summary": "Get invoice preference for a customer",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the customer"
      }
    ]
  },
  {
    "path": "/customer/byStatus",
    "summary": "List customers by status",
    "params": [
      {
        "name": "status",
        "type": "string",
        "required": true,
        "description": "Status ID or Name"
      }
    ]
  },
  {
    "path": "/customer/callLogs/callLogs",
    "summary": "Get call logs",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": false,
        "description": "ID of the Customer"
      },
      {
        "name": "logId",
        "type": "number",
        "required": false,
        "description": "ID of the Call Log"
      },
      {
        "name": "contactId",
        "type": "number",
        "required": false,
        "description": "ID of the Contact"
      },
      {
        "name": "webUser",
        "type": "string",
        "required": false,
        "description": "Username of the web user"
      },
      {
        "name": "notes",
        "type": "string",
        "required": false,
        "description": "Notes for the call log"
      },
      {
        "name": "time",
        "type": "string",
        "required": false,
        "description": "Time of the call"
      },
      {
        "name": "created",
        "type": "string",
        "required": false,
        "description": "Creation timestamp"
      },
      {
        "name": "subject",
        "type": "string",
        "required": false,
        "description": "Subject of the call log"
      },
      {
        "name": "hasBeenEscalated",
        "type": "number",
        "required": false,
        "description": "Escalation status"
      }
    ]
  },
  {
    "path": "/customer/callRecordsEmbedded",
    "summary": "Get embedded call records for a customer",
    "params": [
      {
        "name": "customerID",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/contact/contact",
    "summary": "Get customer contacts",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      },
      {
        "name": "contactId",
        "type": "number",
        "required": false,
        "description": "ID of the Contact"
      }
    ]
  },
  {
    "path": "/customer/contract/contract",
    "summary": "Get contracts for a customer",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      },
      {
        "name": "pending",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/customer/customer",
    "summary": "Get a single customer by ID",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of customer"
      }
    ]
  },
  {
    "path": "/customer/customerPortalNotice",
    "summary": "Get customer portal notices (DataTable endpoint)",
    "params": []
  },
  {
    "path": "/customer/customers",
    "summary": "Get customers with optional filters for site, equipment, IP range, and status.",
    "params": [
      {
        "name": "site_id",
        "type": "number",
        "required": false,
        "description": "Filter by network site ID"
      },
      {
        "name": "equipment_id",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "ip_range",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/customer/equipment/equipment",
    "summary": "Get equipment for a specific customer",
    "params": [
      {
        "name": "customerID",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      },
      {
        "name": "equipmentID",
        "type": "number",
        "required": false,
        "description": "ID of the Equipment"
      }
    ]
  },
  {
    "path": "/customer/eventLogs/eventLogs",
    "summary": "Get event logs",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      },
      {
        "name": "id",
        "type": "number",
        "required": false,
        "description": "ID of the Event Log"
      },
      {
        "name": "username",
        "type": "string",
        "required": false,
        "description": "Username of the web user"
      },
      {
        "name": "text",
        "type": "string",
        "required": false,
        "description": "Text message"
      },
      {
        "name": "time",
        "type": "string",
        "required": false,
        "description": "Time of the log"
      },
      {
        "name": "subject",
        "type": "string",
        "required": false,
        "description": "Subject of the event log"
      },
      {
        "name": "type",
        "type": "string",
        "required": false,
        "description": "Type of the event log. One of: {'Billing','Note','Activation','Status Change','Disconnect','Old Style','Services','Installation','Equipment Change','Customer Ch"
      },
      {
        "name": "_page",
        "type": "number",
        "required": false,
        "description": "Page number"
      },
      {
        "name": "_pageSize",
        "type": "number",
        "required": false,
        "description": "Count of the Event Log on page"
      }
    ]
  },
  {
    "path": "/customer/find",
    "summary": "Search for customers by name or phone number",
    "params": [
      {
        "name": "query",
        "type": "string",
        "required": true,
        "description": ""
      }
    ]
  },
  {
    "path": "/customer/salesPerson/salesPerson",
    "summary": "Get sales person for a customer",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/scheduledEvent/scheduledEvent",
    "summary": "Get a scheduled event",
    "params": [
      {
        "name": "eventId",
        "type": "number",
        "required": true,
        "description": "ID of the Scheduled Event"
      }
    ]
  },
  {
    "path": "/customer/service/service",
    "summary": "Get customer services",
    "params": [
      {
        "name": "serviceId",
        "type": "number",
        "required": true,
        "description": "ID of the Service"
      },
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/smsLogs",
    "summary": "Get SMS logs for a customer",
    "params": [
      {
        "name": "customerID",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/tags/customer",
    "summary": "List tags for a customer",
    "params": [
      {
        "name": "customerID",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/customer/tags/tags",
    "summary": "Get tags",
    "params": [
      {
        "name": "tagID",
        "type": "number",
        "required": false,
        "description": "ID of the Tag"
      }
    ]
  },
  {
    "path": "/customer/transaction",
    "summary": "Get transactions for a customer",
    "params": [
      {
        "name": "customerid",
        "type": "number",
        "required": true,
        "description": "ID of the Customer"
      }
    ]
  },
  {
    "path": "/equipment/dhcpLogs",
    "summary": "Get DHCP logs by IP address and RMU ID",
    "params": [
      {
        "name": "ipAddress",
        "type": "string",
        "required": true,
        "description": "IP address"
      },
      {
        "name": "rmuId",
        "type": "number",
        "required": true,
        "description": "RMU ID"
      }
    ]
  },
  {
    "path": "/equipment/equipment",
    "summary": "Get equipment by ID",
    "params": [
      {
        "name": "equipmentId",
        "type": "number",
        "required": true,
        "description": "Equipment ID"
      }
    ]
  },
  {
    "path": "/equipment/equipments",
    "summary": "Get equipment with site, type, SNMP, and parent info",
    "params": [
      {
        "name": "site_id",
        "type": "number",
        "required": false,
        "description": "Filter by network site ID"
      }
    ]
  },
  {
    "path": "/equipment/equipmentWithDeviceConfigurationFile",
    "summary": "Get equipment with device configuration file",
    "params": [],
    "restricted": "device configuration files often hold credentials"
  },
  {
    "path": "/equipment/interface",
    "summary": "Get equipment interface data",
    "params": []
  },
  {
    "path": "/equipment/trangoAction",
    "summary": "Update rack and tray for switch equipment",
    "params": [
      {
        "name": "action",
        "type": "string",
        "required": true,
        "description": "Action"
      },
      {
        "name": "deviceId",
        "type": "string",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "Trango endpoints; trangoAction mutates through GET"
  },
  {
    "path": "/equipment/trangoEquipment",
    "summary": "Get Trango equipment data",
    "params": [],
    "restricted": "Trango endpoints; trangoAction mutates through GET"
  },
  {
    "path": "/files/files",
    "summary": "List files uploaded",
    "params": [
      {
        "name": "view",
        "type": "string",
        "required": true,
        "description": "Entity type: accounts, equipment, or sites"
      },
      {
        "name": "oid",
        "type": "number",
        "required": true,
        "description": "Object identifier: CustomerID, EquipmentID, or NetworkLocationID"
      },
      {
        "name": "type",
        "type": "string",
        "required": false,
        "description": "Limit to 'files' or 'images'; omit to list both"
      }
    ]
  },
  {
    "path": "/install/dashboardData",
    "summary": "Get install dashboard data with job stats and user metrics",
    "params": [
      {
        "name": "month",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/inventory/conditions",
    "summary": "Get inventory conditions",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Condition unique ID"
      }
    ]
  },
  {
    "path": "/inventory/consumables",
    "summary": "Get consumables from inventory",
    "params": [
      {
        "name": "consumableID",
        "type": "number",
        "required": false,
        "description": "Consumable unique ID"
      }
    ]
  },
  {
    "path": "/inventory/items",
    "summary": "Get items from inventory",
    "params": [
      {
        "name": "itemID",
        "type": "number",
        "required": false,
        "description": "Item unique ID"
      }
    ]
  },
  {
    "path": "/inventory/manufacturers",
    "summary": "Get inventory manufacturers",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Manufacturer unique ID"
      }
    ]
  },
  {
    "path": "/inventory/products",
    "summary": "Get products from inventory",
    "params": [
      {
        "name": "productID",
        "type": "number",
        "required": false,
        "description": "Product unique ID"
      }
    ]
  },
  {
    "path": "/inventory/types",
    "summary": "Get inventory types",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Type unique ID"
      }
    ]
  },
  {
    "path": "/inventory/vendors",
    "summary": "Get inventory vendors",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Vendor unique ID"
      }
    ]
  },
  {
    "path": "/items/checkIfDeviceTypeNameIsUnique",
    "summary": "Check if a device type name is unique",
    "params": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Device type name to check"
      },
      {
        "name": "selectedDeviceType",
        "type": "number",
        "required": false,
        "description": "Device type ID to exclude from check"
      }
    ],
    "restricted": "validation helper, not data"
  },
  {
    "path": "/items/contractTemplate",
    "summary": "Get contract templates",
    "params": [
      {
        "name": "contractTemplateID",
        "type": "number",
        "required": false,
        "description": "Contract template ID"
      }
    ]
  },
  {
    "path": "/items/customerGroups",
    "summary": "Get customer groups",
    "params": [
      {
        "name": "groupID",
        "type": "number",
        "required": false,
        "description": "Customer group ID"
      }
    ]
  },
  {
    "path": "/items/deviceConfigurationFiles",
    "summary": "Get device configuration files",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Device configuration file ID"
      }
    ],
    "restricted": "device configuration files often hold credentials"
  },
  {
    "path": "/items/serviceArea",
    "summary": "Get service areas",
    "params": [
      {
        "name": "ID",
        "type": "number",
        "required": false,
        "description": "Service area ID"
      }
    ]
  },
  {
    "path": "/items/trangoSoftware",
    "summary": "Get Trango device software information",
    "params": [
      {
        "name": "deviceId",
        "type": "number",
        "required": true,
        "description": "Device ID"
      }
    ],
    "restricted": "Trango device software"
  },
  {
    "path": "/network/inventory",
    "summary": "Get network associated inventory",
    "params": [
      {
        "name": "networkId",
        "type": "number",
        "required": true,
        "description": "Network location ID"
      }
    ]
  },
  {
    "path": "/network/sites",
    "summary": "Get all network sites with address and status information",
    "params": []
  },
  {
    "path": "/ping",
    "summary": "Returns the current time to verify UAPI connectivity",
    "params": []
  },
  {
    "path": "/powercode/configValue",
    "summary": "Get a configuration value",
    "params": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "description": "Configuration name"
      },
      {
        "name": "group",
        "type": "string",
        "required": false,
        "description": "Configuration group"
      },
      {
        "name": "default",
        "type": "string",
        "required": false,
        "description": "Default value if not found"
      }
    ],
    "restricted": "system configuration values and license"
  },
  {
    "path": "/powercode/license",
    "summary": "Get a Powercode license",
    "params": [],
    "restricted": "system configuration values and license"
  },
  {
    "path": "/report/customerDataDump",
    "summary": "Get customer data dump report",
    "params": [
      {
        "name": "export",
        "type": "string",
        "required": false,
        "description": "Export format"
      }
    ],
    "restricted": "whole-customer data dump"
  },
  {
    "path": "/report/revenueByTower",
    "summary": "Get Revenue By Tower report",
    "params": [
      {
        "name": "startDate",
        "type": "string",
        "required": true,
        "description": "Start Date in format Y-m-d"
      },
      {
        "name": "endDate",
        "type": "string",
        "required": true,
        "description": "End Date in format Y-m-d"
      },
      {
        "name": "export",
        "type": "string",
        "required": false,
        "description": "Export format"
      }
    ]
  },
  {
    "path": "/schedule/allJobNotesOnCustomer",
    "summary": "Get all job notes on a customer",
    "params": [
      {
        "name": "customerID",
        "type": "number",
        "required": true,
        "description": "Customer ID"
      }
    ]
  },
  {
    "path": "/schedule/completedJobFields",
    "summary": "Completed a job",
    "params": [
      {
        "name": "jobId",
        "type": "number",
        "required": true,
        "description": "ID of the job"
      }
    ],
    "restricted": "summary says it completes a job"
  },
  {
    "path": "/schedule/job",
    "summary": "Get scheduled jobs with optional filters",
    "params": [
      {
        "name": "WebUserID",
        "type": "number",
        "required": false,
        "description": "Filter by web user ID"
      },
      {
        "name": "ScheduledJobID",
        "type": "number",
        "required": false,
        "description": "Filter by scheduled job ID"
      },
      {
        "name": "CustomerID",
        "type": "number",
        "required": false,
        "description": "Filter by customer ID"
      },
      {
        "name": "NetworkSiteID",
        "type": "number",
        "required": false,
        "description": "Filter by network site ID"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Maximum number of results to return"
      },
      {
        "name": "page",
        "type": "number",
        "required": false,
        "description": "Page number for pagination"
      },
      {
        "name": "pageSize",
        "type": "number",
        "required": false,
        "description": "Number of results per page"
      }
    ]
  },
  {
    "path": "/schedule/scheduledJob",
    "summary": "Get a scheduled job by ID",
    "params": [
      {
        "name": "jobId",
        "type": "number",
        "required": true,
        "description": "ID of the job"
      }
    ]
  },
  {
    "path": "/schedule/scheduledJobs",
    "summary": "Get a scheduled job list",
    "params": [
      {
        "name": "startDay",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "endDay",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_page",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_pageSize",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/schedule/scheduledJobsOnCustomer",
    "summary": "Get a scheduled job list for a customer",
    "params": [
      {
        "name": "customerId",
        "type": "number",
        "required": true,
        "description": "Customer ID"
      }
    ]
  },
  {
    "path": "/servers/canopyRadiusServer",
    "summary": "Get canopy RADIUS server(s)",
    "params": [
      {
        "name": "canopyRadiusID",
        "type": "number",
        "required": false,
        "description": "Canopy RADIUS server ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/domainsServerAssociated",
    "summary": "Get domains associated with a server",
    "params": [
      {
        "name": "emailServerId",
        "type": "number",
        "required": true,
        "description": "Email server ID"
      },
      {
        "name": "domainID",
        "type": "number",
        "required": false,
        "description": "Domain ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/emailServer",
    "summary": "Get email server(s)",
    "params": [
      {
        "name": "emailServerID",
        "type": "number",
        "required": false,
        "description": "Email server ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/radiusAttribute",
    "summary": "Get RADIUS attribute(s)",
    "params": [
      {
        "name": "radiusAttributeID",
        "type": "number",
        "required": false,
        "description": "RADIUS attribute ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/radiusEventLog",
    "summary": "Get RADIUS event log",
    "params": [
      {
        "name": "radiusServerID",
        "type": "number",
        "required": true,
        "description": "RADIUS server ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/radiusServer",
    "summary": "Get RADIUS server(s)",
    "params": [
      {
        "name": "radiusServerID",
        "type": "number",
        "required": false,
        "description": "RADIUS server ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/radiusServerStatus",
    "summary": "Get RADIUS server status",
    "params": [],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/radiusUserGroup",
    "summary": "Get RADIUS user group(s)",
    "params": [
      {
        "name": "radiusUserGroupID",
        "type": "number",
        "required": false,
        "description": "RADIUS user group ID"
      },
      {
        "name": "radiusServerID",
        "type": "number",
        "required": false,
        "description": "RADIUS server ID"
      }
    ],
    "restricted": "server definitions can carry shared secrets"
  },
  {
    "path": "/servers/syncCanopyRadiusServer",
    "summary": "Synchronize a canopy RADIUS server",
    "params": [
      {
        "name": "canopyRadiusID",
        "type": "number",
        "required": true,
        "description": "Canopy RADIUS server ID"
      }
    ],
    "restricted": "acts through GET: synchronizes a server"
  },
  {
    "path": "/servers/syncRadiusServer",
    "summary": "Synchronize a RADIUS server",
    "params": [
      {
        "name": "radiusServerID",
        "type": "number",
        "required": true,
        "description": "RADIUS server ID"
      }
    ],
    "restricted": "acts through GET: synchronizes a server"
  },
  {
    "path": "/services/service",
    "summary": "Get a single service by ID, or list all services (paginated)",
    "params": [
      {
        "name": "serviceId",
        "type": "number",
        "required": false,
        "description": "ID of the service to retrieve. If omitted, returns a paginated list of all services."
      },
      {
        "name": "_page",
        "type": "number",
        "required": false,
        "description": "Page number for paginated results"
      },
      {
        "name": "_pageSize",
        "type": "number",
        "required": false,
        "description": "Number of results per page"
      }
    ]
  },
  {
    "path": "/signContract",
    "summary": "Sign the contract specified by the ContractTemplateID field",
    "params": [
      {
        "name": "ContractTemplateID",
        "type": "number",
        "required": true,
        "description": "ID of the contract template to be signed"
      },
      {
        "name": "PrintedName",
        "type": "string",
        "required": true,
        "description": "Name of the person signing the contract"
      },
      {
        "name": "SignatureImage",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "UserAgentString",
        "type": "string",
        "required": true,
        "description": "Information about the user's device for verification"
      }
    ],
    "restricted": "acts through GET: signs a contract"
  },
  {
    "path": "/sp",
    "summary": "SAML Service Provider endpoint for SSO metadata, assertion consumer, and logout",
    "params": [
      {
        "name": "metadata",
        "type": "string",
        "required": false,
        "description": "If set, returns SAML metadata"
      },
      {
        "name": "idp",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "acs",
        "type": "string",
        "required": false,
        "description": "If set, triggers assertion consumer service"
      },
      {
        "name": "sls",
        "type": "string",
        "required": false,
        "description": "If set, triggers single logout service"
      }
    ],
    "restricted": "SAML service provider endpoint"
  },
  {
    "path": "/subscriber/appointments/appointments",
    "summary": "Gets a list of appointments for the user",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/appointments/cancelAppointment",
    "summary": "Cancels an appointment",
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/appointments/rescheduleAppointment",
    "summary": "Reschedules an appointment",
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/branding/branding",
    "summary": "Gets branding information for the app such as logos, color schemes, company information, etc.",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/contracts/pendingContracts",
    "summary": "Gets a list of pending contracts for the customer",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/contracts/signContract",
    "summary": "Sign the contract specified by the ContractTemplateID field",
    "params": [
      {
        "name": "contractTemplateID",
        "type": "number",
        "required": true,
        "description": ""
      },
      {
        "name": "printedName",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "signatureImage",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "userAgentString",
        "type": "string",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/invoices/invoicePDF",
    "summary": "Gets a PDF invoice for the invoice specified by ID",
    "params": [
      {
        "name": "id",
        "type": "number",
        "required": true,
        "description": ""
      },
      {
        "name": "invoiceID",
        "type": "number",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/invoices/invoices",
    "summary": "Gets a list of invoices for the current customer",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/payments/addNewCreditCard",
    "summary": "Add new credit card to customer account for future payments",
    "params": [
      {
        "name": "cardName",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "cardNumber",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "expMonth",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "expYear",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "cardType",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "automatic",
        "type": "number",
        "required": true,
        "description": ""
      },
      {
        "name": "cvc",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "address",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "city",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "state",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "zip",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "country",
        "type": "string",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/payments/paymentMethods",
    "summary": "Gets payment methods for subscribers",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/services/services",
    "summary": "Gets a list of services the current user has",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/seven/usageSummary",
    "summary": "Get data usage summary",
    "params": [
      {
        "name": "usageRange",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "granularity",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "units",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "rounding",
        "type": "number",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/tickets/createTicket",
    "summary": "Creates a support ticket for a customer",
    "params": [
      {
        "name": "ticketSummary",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "ticketDescription",
        "type": "string",
        "required": true,
        "description": ""
      }
    ],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/tickets/tickets",
    "summary": "Gets a list of tickets for the user",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/transactions/transactions",
    "summary": "Gets a list of transactions for the user",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/subscriber/user/user",
    "summary": "Gets information about the current customer",
    "params": [],
    "restricted": "customer-portal endpoint acting as a subscriber; some mutate through GET"
  },
  {
    "path": "/system/diskUsage",
    "summary": "Returns disk usage and storage statistics",
    "params": []
  },
  {
    "path": "/system/serviceAreas",
    "summary": "Get service areas by type (country or state)",
    "params": [
      {
        "name": "type",
        "type": "string",
        "required": true,
        "description": ""
      },
      {
        "name": "country",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "default",
        "type": "string",
        "required": false,
        "description": "Return default states for the given country"
      }
    ]
  },
  {
    "path": "/system/systemHealth",
    "summary": "Returns system health data including CPU, memory, swap, and disk usage",
    "params": []
  },
  {
    "path": "/tickets/tickets",
    "summary": "Get tickets with optional filters for status, responsible user, and date ranges",
    "params": [
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "responsibleUser",
        "type": "string",
        "required": false,
        "description": "Filter by assigned username"
      },
      {
        "name": "updatedSince",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "createdSince",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_orderBy",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_page",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_pageSize",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/tickets/ticketsByDate",
    "summary": "Get all tickets within a date range, with pagination and order by",
    "params": [
      {
        "name": "startDay",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "endDay",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_orderBy",
        "type": "string",
        "required": false,
        "description": ""
      },
      {
        "name": "_page",
        "type": "number",
        "required": false,
        "description": "Page number"
      },
      {
        "name": "_pageSize",
        "type": "number",
        "required": false,
        "description": "Results per page"
      }
    ]
  },
  {
    "path": "/tickets/ticketsByUser",
    "summary": "Get per-user ticket statistics for wallboard display",
    "params": []
  },
  {
    "path": "/tickets/ticketStats",
    "summary": "Get aggregate ticket statistics: counts by status and today's activity",
    "params": []
  },
  {
    "path": "/tickets/ticketStatsByGroup",
    "summary": "Get ticket statistics broken down by handler group for wallboard display",
    "params": []
  },
  {
    "path": "/user/user",
    "summary": "Get information about web users",
    "params": [
      {
        "name": "webUserId",
        "type": "string",
        "required": false,
        "description": ""
      }
    ],
    "restricted": "single-user detail carries Google2faSecret, SquareToken, MapToken, CalendarKey"
  },
  {
    "path": "/user/users",
    "summary": "Get all web users with status and permission group info",
    "params": [
      {
        "name": "status",
        "type": "string",
        "required": false,
        "description": ""
      }
    ]
  },
  {
    "path": "/widget/throughput",
    "summary": "Get widget/throughput",
    "params": []
  }
];
