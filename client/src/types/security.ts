export interface SecurityCheck {
  group: string;
  title: string;
  status: string;
  description: string;
}

interface DataDesktopSecurity {
  diagnostics: Record<string, any>; // adjust if you know the structure of diagnostics
  passed: SecurityCheck[];
  failed: SecurityCheck[];
  score: number;
}

export interface SecurityDataType {
  data_desktop_security: DataDesktopSecurity;
}
