export type ErrorReportContext = Readonly<{
  source: string;
}>;

export type ErrorReporter = (error: Error, context: ErrorReportContext) => void;

const noopReporter: ErrorReporter = () => undefined;
let activeReporter = noopReporter;

export function configureErrorReporter(reporter: ErrorReporter) {
  const previousReporter = activeReporter;
  activeReporter = reporter;

  return () => {
    activeReporter = previousReporter;
  };
}

export function reportError(error: Error, context: ErrorReportContext) {
  try {
    activeReporter(error, context);
  } catch {
    // Error reporting must never turn a recoverable render failure into another app failure.
  }
}
