import chalk from 'chalk';

export const infoLog = (source: string, message: string) => {
  console.log(`${chalk.blue.bold(source)} -- ${message}`);
};

export const warnLog = (source: string, message: string) => {
  console.log(`${chalk.yellow.bold(source)} -- ${message}`);
};

export const successLog = (source: string, message: string) => {
  console.log(`${chalk.green.bold(source)} -- ${message}`);
};

export const errorLog = (source: string, message: string) => {
  console.log(`${chalk.red.bold(source)} -- ${message}`);
};
