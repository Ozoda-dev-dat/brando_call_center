export type UserRole = 'admin' | 'operator' | 'master';

export interface PermissionCheck {
  canCreateTicket: boolean;
  canEditCustomer: boolean;
  canViewAllCustomers: boolean;
  canChangeTicketStatus: boolean;
  canUploadPhotos: boolean;
  canAddPayment: boolean;
  canUnblockPayment: boolean;
  canCollectSignature: boolean;
  canViewGPSTracking: boolean;
  canManageServiceCenters: boolean;
  canManageMasters: boolean;
  canApprovePrice: boolean;
  canConfigureFraudTriggers: boolean;
  canAdjustHonestyScore: boolean;
  canReopenTickets: boolean;
  canViewFullDashboard: boolean;
  canViewOwnMetricsOnly: boolean;
  canViewAllFraudAlerts: boolean;
  canViewOwnFraudAlertsOnly: boolean;
  canViewFraudAlertsAsWarning: boolean;
  canResolveFraudAlerts: boolean;
  canMakeQualityCall: boolean;
  canEditSMSTemplates: boolean;
  canAccessOperatorPanel: boolean;
  canViewOperatorPanel: boolean;
  canCheckWarranty: boolean;
  canModifyWarrantyStatus: boolean;
}

export function getPermissions(role: UserRole): PermissionCheck {
  switch (role) {
    case 'admin':
      return {
        canCreateTicket: true,
        canEditCustomer: true,
        canViewAllCustomers: true,
        canChangeTicketStatus: true,
        canUploadPhotos: false,
        canAddPayment: false,
        canUnblockPayment: true,
        canCollectSignature: false,
        canViewGPSTracking: false,
        canManageServiceCenters: true,
        canManageMasters: true,
        canApprovePrice: true,
        canConfigureFraudTriggers: true,
        canAdjustHonestyScore: true,
        canReopenTickets: true,
        canViewFullDashboard: true,
        canViewOwnMetricsOnly: false,
        canViewAllFraudAlerts: true,
        canViewOwnFraudAlertsOnly: false,
        canViewFraudAlertsAsWarning: false,
        canResolveFraudAlerts: true,
        canMakeQualityCall: true,
        canEditSMSTemplates: true,
        canAccessOperatorPanel: false,
        canViewOperatorPanel: true,
        canCheckWarranty: true,
        canModifyWarrantyStatus: true,
      };
    case 'operator':
      return {
        canCreateTicket: true,
        canEditCustomer: true,
        canViewAllCustomers: true,
        canChangeTicketStatus: true, 
        canUploadPhotos: false,
        canAddPayment: false,
        canUnblockPayment: false,
        canCollectSignature: false,
        canViewGPSTracking: false,
        canManageServiceCenters: false,
        canManageMasters: false,
        canApprovePrice: false,
        canConfigureFraudTriggers: false,
        canAdjustHonestyScore: false,
        canReopenTickets: false,
        canViewFullDashboard: false,
        canViewOwnMetricsOnly: true,
        canViewAllFraudAlerts: true,
        canViewOwnFraudAlertsOnly: false,
        canViewFraudAlertsAsWarning: true,
        canResolveFraudAlerts: false,
        canMakeQualityCall: true,
        canEditSMSTemplates: false,
        canAccessOperatorPanel: true,
        canViewOperatorPanel: true,
        canCheckWarranty: true,
        canModifyWarrantyStatus: false,
      };
    case 'master':
      return {
        canCreateTicket: false,
        canEditCustomer: false,
        canViewAllCustomers: false,
        canChangeTicketStatus: true, 
        canUploadPhotos: true,
        canAddPayment: true, 
        canUnblockPayment: false,
        canCollectSignature: true,
        canViewGPSTracking: true,
        canManageServiceCenters: false,
        canManageMasters: false,
        canApprovePrice: false,
        canConfigureFraudTriggers: false,
        canAdjustHonestyScore: false,
        canReopenTickets: false,
        canViewFullDashboard: false,
        canViewOwnMetricsOnly: true,
        canViewAllFraudAlerts: false,
        canViewOwnFraudAlertsOnly: true,
        canViewFraudAlertsAsWarning: false,
        canResolveFraudAlerts: false,
        canMakeQualityCall: false,
        canEditSMSTemplates: false,
        canAccessOperatorPanel: false,
        canViewOperatorPanel: false,
        canCheckWarranty: true, 
        canModifyWarrantyStatus: false,
      };
    default:
      return {
        canCreateTicket: false,
        canEditCustomer: false,
        canViewAllCustomers: false,
        canChangeTicketStatus: false,
        canUploadPhotos: false,
        canAddPayment: false,
        canUnblockPayment: false,
        canCollectSignature: false,
        canViewGPSTracking: false,
        canManageServiceCenters: false,
        canManageMasters: false,
        canApprovePrice: false,
        canConfigureFraudTriggers: false,
        canAdjustHonestyScore: false,
        canReopenTickets: false,
        canViewFullDashboard: false,
        canViewOwnMetricsOnly: false,
        canViewAllFraudAlerts: false,
        canViewOwnFraudAlertsOnly: false,
        canViewFraudAlertsAsWarning: false,
        canResolveFraudAlerts: false,
        canMakeQualityCall: false,
        canEditSMSTemplates: false,
        canAccessOperatorPanel: false,
        canViewOperatorPanel: false,
        canCheckWarranty: false,
        canModifyWarrantyStatus: false,
      };
  }
}

export function canAccess(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}
