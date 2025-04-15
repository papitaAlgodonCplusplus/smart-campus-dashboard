import { useTexture, Plane } from '@react-three/drei';

import diffuseTexture from '../../../textures/forrest_ground_01_diff_4k.jpg';
import normalTexture from '../../../textures/forrest_ground_01_disp_4k.png';
import roughnessTexture from '../../../textures/forrest_ground_01_rough_4k.jpg';

// Enhanced ground component with textures
const Ground = () => {
  const x_0 = 28
  const x = -2
  const x_2 = -32
  const x_3 = -62
  const x_4 = -92
  const textures = useTexture({
    map: diffuseTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
  });
  return (
    <>
      {/* Base ground */}
      <mesh>

        {/* Tile 0 */}
        <group>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -30]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -60]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -90]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 1 */}
        <group>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -30]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -60]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -90]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 2 */}
        <group>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -30]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -60]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -90]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 3 */}
        <group>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -30]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -60]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -90]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 4 */}
        <group>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -30]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -60]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[30, 40, 64, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -90]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>
      </mesh>
    </>
  );
};

export default Ground;