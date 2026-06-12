export function journalBookFilename(month: string, extension: 'xlsx' | 'pdf') {
  return `daftar-yawmiya-${month}.${extension}`;
}

export function ledgerFilename(
  accountCode: string,
  from: string | undefined,
  to: string | undefined,
  extension: 'xlsx' | 'pdf',
) {
  const datePart = from || to || new Date().toISOString().slice(0, 10);
  return `daftar-ustadh-${accountCode}-${datePart}.${extension}`;
}

export function statementFilename(
  accountCode: string,
  from: string | undefined,
  to: string | undefined,
  extension: 'xlsx' | 'pdf',
  monthly = false,
) {
  const prefix = monthly ? 'daftar-ustadh-shahri' : 'kashf-hisab';
  const datePart =
    from?.slice(0, 7) || from || to || new Date().toISOString().slice(0, 10);
  return `${prefix}-${accountCode}-${datePart}.${extension}`;
}

export function trialBalanceFilename(
  from: string | undefined,
  to: string | undefined,
  extension: 'xlsx' | 'pdf',
) {
  const datePart = from || to || new Date().toISOString().slice(0, 10);
  return `mizan-muraja'a-${datePart}.${extension}`;
}

export function employeesFilename(extension: 'xlsx' | 'pdf') {
  return `sijil-muwazzafin-${new Date().toISOString().slice(0, 10)}.${extension}`;
}

export function payrollFilename(
  month: string,
  year: number,
  extension: 'xlsx' | 'pdf',
) {
  return `masir-rawatib-${year}-${month}.${extension}`;
}
