const YAML = require('yamljs');
const path = require('path');

function generateSwaggerConfig(port) {
    const yamlFilePath = path.join(__dirname, 'api-docs.yaml');
    const swaggerConfig = YAML.load(yamlFilePath);
    swaggerConfig.servers = [{ url: `http://localhost:${port}` }];
    return swaggerConfig;
}

module.exports.generateSwaggerConfig = generateSwaggerConfig;
