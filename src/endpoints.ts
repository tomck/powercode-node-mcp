// Generated from the server's /docs/openapi.json (Powercode UAPI V26.10.05). GET endpoints only.
// Excludes credential-bearing, action-via-GET, file and AI endpoints; see the exclusion list in the generator.
export interface EndpointParam { name: string; type: "string" | "number" | "boolean" | "array"; required: boolean; description: string }
export interface Endpoint { path: string; summary: string; params: EndpointParam[] }
export const specVersion = "V26.10.05";
export const endpoints: Endpoint[] = [
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
    "path": "/equipment/interface",
    "summary": "Get equipment interface data",
    "params": []
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
