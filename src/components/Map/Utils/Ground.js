import { useTexture, Plane } from '@react-three/drei';

import diffuseTexture from '../../../textures/forrest_ground_01_diff_4k.jpg';
import normalTexture from '../../../textures/forrest_ground_01_disp_4k.png';
import roughnessTexture from '../../../textures/forrest_ground_01_rough_4k.jpg';

// Enhanced ground component with textures
const Ground = () => {
  const x_00 = 68
  const x_0 = 38
  const x = -2
  const x_2 = -42
  const x_3 = -82
  const x_4 = -122
  const x_5 = -142
  const x_6 = -162
  const textures = useTexture({
    map: diffuseTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
  });
  return (
    <>
      {/* Base ground */}
      <mesh>
        {/* Tile Entrance */}
        <group>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_00, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_00, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_00, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_00, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_00, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 0 */}
        <group>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_0, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 1 */}
        <group>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 2 */}
        <group>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_2, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 3 */}
        <group>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_3, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>

        {/* Tile 4 */}
        <group>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -40]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -80]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -120]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -160]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>

          <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_4, -1, -200]} receiveShadow>
            <meshStandardMaterial
              map={textures.map}
              displacementMap={textures.normalMap}
              roughnessMap={textures.roughnessMap}
            />
          </Plane>
        </group>
      </mesh>

      {/* Tile 5 */}
      <group>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_5, -1, -40]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_5, -1, -80]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_5, -1, -120]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_5, -1, -160]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_5, -1, -200]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
      </group>

      {/* Tile 6 */}
      <group>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_6, -1, -40]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_6, -1, -80]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_6, -1, -120]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_6, -1, -160]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
        <Plane args={[40, 40, 32, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[x_6, -1, -200]} receiveShadow>
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.normalMap}
            roughnessMap={textures.roughnessMap}
          />
        </Plane>
      </group>
    </>
  );
};

export default Ground;