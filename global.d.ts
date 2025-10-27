// Provide minimal global declarations for test utilities referenced in test files
declare var jest: any;

declare namespace jest {
	interface Mock extends Function {}
}
