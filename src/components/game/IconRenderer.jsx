import { X, Circle, Triangle, Square, Hexagon } from 'lucide-react';

const icons = { X, Circle, Triangle, Square, Hexagon };

const IconRenderer = ({ iconName, ...props }) => {
    const Icon = icons[iconName];
    return Icon ? <Icon {...props} /> : null;
};

export default IconRenderer;
