import Building from './Building';

interface Campus3DMapProps {
  buildings: Building[];
  onBuildingSelect?: (building: Building) => void;
}

export default Campus3DMapProps;