const YAML = require('yamljs');
const path = require('path');

function generateSwaggerConfig(port) {
    const yamlFilePath = path.join(__dirname, 'api-docs.yaml');
    const swaggerYAMLConfig = YAML.load(yamlFilePath);
    swaggerYAMLConfig.servers = [{ url: `http://localhost:${port}` }];
    return swaggerYAMLConfig;
}

module.exports.generateSwaggerConfig = generateSwaggerConfig;
