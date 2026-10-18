import * as THREE from 'three';

export interface CrochetMaterialProps {
  color?: string | THREE.Color;
  highlightColor?: string | THREE.Color;
  isHighlighted?: boolean;
  roughness?: number;
  fuzziness?: number;
  stitchScale?: [number, number];
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighlightColor;
  uniform float uIsHighlighted;
  uniform float uRoughness;
  uniform float uFuzziness;
  uniform vec2 uStitchScale;
  uniform vec3 uLightDir;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Ondulações procedurais do ponto de crochê (laçadas em "V" entrelaçadas)
    float rowWave = sin(vUv.y * uStitchScale.y);
    float stitchWave = cos(vUv.x * uStitchScale.x + rowWave * 1.2);
    float tactileRelief = (stitchWave * 0.5 + 0.5) * (rowWave * 0.4 + 0.6);

    // Efeito de sombra e relevo na fibra do fio
    vec3 lightDir = normalize(uLightDir);
    float diffuse = max(dot(normal, lightDir), 0.2);
    float yarnShadow = mix(0.75, 1.15, tactileRelief);

    // Efeito aveludado / pilosidade do fio (Fresnel halo / sheen)
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);
    vec3 haloFuzz = vec3(1.0) * fresnel * uFuzziness * 0.6;

    // Cor base mesclada com relevo tátil
    vec3 baseCol = uColor * diffuse * yarnShadow;
    vec3 finalColor = baseCol + haloFuzz;

    // Destaque quando o ponto/carreira estiver selecionado
    if (uIsHighlighted > 0.5) {
      finalColor = mix(finalColor, uHighlightColor, 0.45 + 0.25 * sin(tactileRelief * 6.28));
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export class CrochetShaderMaterial extends THREE.ShaderMaterial {
  constructor(props: CrochetMaterialProps = {}) {
    const col = props.color instanceof THREE.Color ? props.color : new THREE.Color(props.color || '#38bdf8');
    const highlight = props.highlightColor instanceof THREE.Color ? props.highlightColor : new THREE.Color(props.highlightColor || '#facc15');

    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: col },
        uHighlightColor: { value: highlight },
        uIsHighlighted: { value: props.isHighlighted ? 1.0 : 0.0 },
        uRoughness: { value: props.roughness ?? 0.45 },
        uFuzziness: { value: props.fuzziness ?? 0.4 },
        uStitchScale: { value: new THREE.Vector2(props.stitchScale?.[0] ?? 40.0, props.stitchScale?.[1] ?? 35.0) },
        uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.8) },
      },
    });
  }

  setColor(color: string | THREE.Color) {
    if (color instanceof THREE.Color) {
      this.uniforms.uColor.value = color;
    } else {
      this.uniforms.uColor.value.set(color);
    }
  }

  setHighlight(active: boolean) {
    this.uniforms.uIsHighlighted.value = active ? 1.0 : 0.0;
  }
}
