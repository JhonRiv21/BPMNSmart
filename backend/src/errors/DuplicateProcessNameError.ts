export class DuplicateProcessNameError extends Error {
  constructor() {
    super('DUPLICATE_PROCESS_NAME');
    this.name = 'DuplicateProcessNameError';
  }
}
