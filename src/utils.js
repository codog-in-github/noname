export const imageReader = input => new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(input.files[0])
    fileReader.onload = () => {
        resolve(fileReader.result)
    }
})

export const getRGB = (image, width = 512, height = 512) => {
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0, width, height)
    return ctx.getImageData(0, 0, width, height).data;
}

export const imageOnload = image => new Promise((resolve) => {
    image.onload = () => resolve(image)
})
