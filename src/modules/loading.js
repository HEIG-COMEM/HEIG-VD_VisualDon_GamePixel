const loading = () => {
    const loading = document.createElement('div')
    loading.id = 'loading'
    loading.innerHTML = `
        <div class="loading">
            <div class="loading_spinner"><div></div><div></div></div>
        </div>
    `
    document.body.appendChild(loading)
}
const destruct = () => {
    document.querySelector('#loading').remove()
}

document.addEventListener('rendering_done', destruct)
loading()
