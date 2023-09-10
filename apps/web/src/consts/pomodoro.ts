import rainAndGuitar from '../assets/sounds/rain_and_guitar.mp3'
import vanillaSky from '../assets/sounds/Vanilla_Sky_2.mp3'
import arpeggioOfSeawind from '../assets/sounds/arpeggio_of_seawind.mp3'
import atSmallCafeInHighland from '../assets/sounds/at_small_cafe_in_highland.mp3'
import envRain from '../assets/sounds/env_rain.mp3'
import envWave from '../assets/sounds/env_wave.mp3'
import envCafe from '../assets/sounds/env_cafe.mp3'

export const POMODORO_TIME = 1500

export const SOUNDS = [
  {
    image: 'https://img.icons8.com/stickers/100/us-music.png',
    label: '雨粒とナイロンギター',
    value: rainAndGuitar,
    description: 'リラックスに最適',
  },
  {
    image: 'https://img.icons8.com/stickers/100/kawaii.png',
    label: 'Vanilla Sky',
    value: vanillaSky,
    description: 'KAWAII Future Bass',
  },
  {
    image: 'https://img.icons8.com/stickers/100/water-element.png',
    label: '海風のアルペジオ',
    value: arpeggioOfSeawind,
    description: 'エモくなりたい時に',
  },
  {
    image: 'https://img.icons8.com/stickers/100/forest.png',
    label: '高原の小さなカフェにて',
    value: atSmallCafeInHighland,
    description: '柔らかくて暖かいひとときを',
  },
  {
    image: 'https://img.icons8.com/stickers/100/wet.png',
    label: '環境音:雨',
    value: envRain,
    description: '雨の音って落ち着くよね',
  },
  {
    image: 'https://img.icons8.com/stickers/100/ocean-wave.png',
    label: '環境音:波',
    value: envWave,
    description: 'さざ波に揺られて',
  },
  {
    image: 'https://img.icons8.com/stickers/100/restaurant-pickup.png',
    label: '環境音:カフェ',
    value: envCafe,
    description: '喧騒の中で集中したい時に',
  },
]
