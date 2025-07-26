import { Card } from 'antd';
import {motion } from 'framer-motion';

const tileColors = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

export default function Tile({ value, isNew, isMerged }) {
  let animationConfig = {
    layout: true,
    animate: { scale: 1, opacity: 1 },
    transition: { type: 'spring', stiffness: 120, damping: 20},
  };

  if (isNew) {
    animationConfig.initial = { scale: 0.6, opacity: 0 };
    animationConfig.transition = { 
      duration: 1, 
      ease: 'easeOut',
    };
  }

  if (isMerged) {
    animationConfig.animate = { scale: [1.15, 1], opacity: 1 };
    animationConfig.transition = { 
      duration: 1, 
      ease: 'easeInOut',
    };
  }

  return (
    <motion.div {...animationConfig}>
      <Card
        style={{
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          backgroundColor: tileColors[value] || '#3c3a32',
          color: value <= 4 ? '#776e65' : '#f9f6f2',
          fontSize: 24,
          fontWeight: 'bold',
          borderRadius: '6px',
          padding: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}
        bordered={false}
      >
        {value !== 0 ? value : ''}
      </Card>
    </motion.div>
  );
}
