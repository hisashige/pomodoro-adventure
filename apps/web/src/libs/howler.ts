import { Howl } from 'howler'

export const getHowl = (sound: string, volume: number) => {
  return new Howl({
    src: sound,
    loop: true,
    volume: volume / 100,
  })
}
