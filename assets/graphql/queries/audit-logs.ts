import { gql } from "@apollo/client";

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($take: Int, $skip: Int, $filter: AuditLogFilter) {
    getAuditLogs(take: $take, skip: $skip, filter: $filter) {
      items {
        id
        entityType
        action
        category
        details
        ipAddress
        userAgent
        createdAt
      }
      total
      hasMore
    }
  }
`;
