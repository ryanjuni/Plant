// O segredo está no '@expo/' antes do nome
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para os modelos 3D que seu grupo vai usar
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;