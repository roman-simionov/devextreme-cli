const jest = require('jest');
const path = require('path');
const minimist = require('minimist');
const envs = [
    require('./env.react'),
    require('./env.vue'),
    require('./env.angular')
];

const args = minimist(process.argv.slice(), {
    default: {
        envirorment: 'all'
    },
    string: ['envirorment'],
    alias: {
        e: 'envirorment'
    }
});

async function runTest(envirorments) {
    const options = {
        testPathIgnorePatterns: [
            './testing/sandbox/'
        ],
        projects: [
            './testing/__tests__'
        ],
        testPathPattern: envirorments.map(env => `./testing/__tests__/${env.engine}.test.js`),
        setupFiles: [
            path.join(process.cwd(), 'jest.config.js')
        ],
        setupFilesAfterEnv: [
            path.join(process.cwd(), 'testing/jest-setup.js')
        ],
        forceExit: true,
        showConfig: false,
        runInBand: true
    };
    jest
        .runCLI(options, options.projects)
        .then(success => {
            success.results.numFailedTestSuites || success.results.numFailedTests
                ? process.exit(1)
                : process.exit(0);
        })
        .catch(() => {
            process.exit(1);
        });
}

(async function testProccess() {
    const filteredEnvs = args.e === 'all'
        ? envs
        : envs.filter(e => e.engine === args.e);
    filteredEnvs.length && runTest(filteredEnvs);
})().catch(reject => console.error(reject));

exports.runTest = runTest;
