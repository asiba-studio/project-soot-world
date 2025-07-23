// src/lib/loadCSS3DRenderer.ts
export const loadCSS3DRenderer = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'))
        return
      }
  
      // すでに読み込まれている場合
      if ((window as any).THREE?.CSS3DRenderer) {
        resolve((window as any).THREE)
        return
      }
  
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      script.onload = () => {
        const css3dScript = document.createElement('script')
        css3dScript.src = 'https://threejs.org/examples/js/renderers/CSS3DRenderer.js'
        css3dScript.onload = () => {
          resolve((window as any).THREE)
        }
        css3dScript.onerror = reject
        document.head.appendChild(css3dScript)
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }