export default {
  name: 'codeRabbit',
  init(app) {
    console.log(`Plugin '${this.name}' initialized.`);
    this.app = app;
  },
  async execute(input) {
    console.log(`Plugin '${this.name}' executed with input:`, input);
    return {
      status: 'analysis_done',
      type: 'feedback',
      message: 'Running code analysis with CodeRabbit...',
      input: input
    };
  }
};
