import { isElementInViewport } from './helper.js'
import Pixie from './modules/Pixie.js'

const pixie = new Pixie()

setTimeout(() => {
    pixie.render()

    const h4 = document.querySelector('#start h1').getBoundingClientRect()

    pixie.move(h4.right + 5, h4.bottom - 38)
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
                text: "Salut, je suis Pixie le pixel. Je vais t'accompagner dans ton aventure.",
            },
            {
                position: {
                    x: 50,
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
                text: "Chaque événement est accompagné d'une description et d'une liste de jeux marquants de cette période.",
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: 'Tu peux cliquer sur un jeu pour en savoir plus.',
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
        count: sessionStorage.getItem('GamePixel-script-tutorial') || 0,
        destroy_trigger: true,
    },
    summary: {
        trigger_id: 'summary',
        steps: [
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Tu t'es bien amusé ?",
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: 'Te voilà arrivé à la fin de cette aventure...',
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Mais ce n'est pas la fin de l'histoire des jeux vidéo !",
            },
            {
                position: {
                    x: 50,
                    y: 50,
                    unit: 'viewport',
                },
                text: "Dans cette section tu trouveras un graphique représentant l'évolution des genres et des plateformes au fil des années.",
            },
        ],
        isSkippable: false,
        isRepeatable: false,
        count: sessionStorage.getItem('GamePixel-script-summary') || 0,
        destroy_trigger: false,
        showBackDrop: true,
    },
}

const preventDefault = (e) => e.preventDefault()

Object.keys(SCRIPT).forEach((key) => {
    const script = SCRIPT[key]

    const triggerSection = document.querySelector(`#${script.trigger_id}`)
    if (!triggerSection)
        return console.error(`Trigger section not found: ${script.trigger_id}`)

    triggerSection.addEventListener(
        'section_visible',
        () => {
            async function runScript() {
                if (script.count >= 1 && !script.isRepeatable) {
                    if (script.destroy_trigger) triggerSection.remove()
                    pixie.moveToIdle()
                    return
                }
                if (!script.isSkippable) {
                    triggerSection.addEventListener('wheel', preventDefault)
                    window.addEventListener('keydown', preventDefault)
                }

                if (script.showBackDrop) {
                    const backDrop = document.createElement('div')
                    backDrop.id = 'pixie-backdrop'
                    document.body.appendChild(backDrop)
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
                sessionStorage.setItem(
                    `GamePixel-script-${key}`,
                    script.count + 1
                )
                pixie.moveToIdle()

                if (script.showBackDrop)
                    document.querySelector('#pixie-backdrop').remove()

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
