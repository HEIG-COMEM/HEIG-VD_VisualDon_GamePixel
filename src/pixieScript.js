import { isElementInViewport } from './helper.js'
import Pixie from './modules/Pixie.js'

const pixie = new Pixie()

setTimeout(() => {
    pixie.render()

    const h4 = document.querySelector('#start h1').getBoundingClientRect()

    pixie.move(h4.right + 5, h4.bottom - 42)
}, 200)

const SCRIPT = {
    tutorial: {
        trigger_id: 'tutorial',
        steps: [
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Salut, je suis Pixie le pixel. Je vais t'accompagner dans ton aventure",
            },
            {
                position: {
                    x: 25,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Plus bas tu trouveras une timeline qui te permettra de naviguer dans les événements qui ont marqué l'histoire des jeux vidéo.",
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Chaques événements est accompagné d'une description et d'une liste de jeux qui ont marqué cette période.",
            },
            {
                position: {
                    x: 75,
                    y: 50,
                    unit: 'viewport',
                },
                text: 'Tu peux clicker sur un jeu pour en savoir plus.',
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: 'Amuse toi bien !',
            },
        ],
        isSkippable: false,
        isRepeatable: false,
        count: 0,
        destroy_trigger: true,
    },
}

const preventDefault = (e) => e.preventDefault() && console.log('key prevented')

Object.keys(SCRIPT).forEach((key) => {
    const script = SCRIPT[key]

    const triggerSection = document.querySelector(`#${script.trigger_id}`)
    if (!triggerSection)
        return console.error(`Trigger section not found: ${script.trigger_id}`)

    triggerSection.addEventListener(
        'section_visible',
        () => {
            async function runScript() {
                if (script.count >= 1 && !script.isRepeatable) return
                if (!script.isSkippable) {
                    triggerSection.addEventListener('wheel', preventDefault)
                    window.addEventListener('keydown', preventDefault)
                }
                for (const step of script.steps) {
                    pixie.move(
                        step.position.x,
                        step.position.y,
                        step.position.unit
                    )
                    pixie.say(step.text)
                    await pixie.wait()
                }
                script.count++
                pixie.moveToIdle()

                if (!script.isSkippable) {
                    triggerSection.removeEventListener('wheel', preventDefault)
                    window.removeEventListener('keydown', preventDefault)
                }

                if (script.destroy_trigger) triggerSection.remove()
            }

            runScript()
        },
        { once: !script.isRepeatable }
    )
})
