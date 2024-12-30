import * as core from '@actions/core'
import { addSidecar } from './sidecar'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const taskDefPath: string = core.getInput('task-definition')
    const otelContainerDef = {
      containerDefinitions: [
        {
          name: 'otel-collector',
          image: 'otel/opentelemetry-collector:0.33.0',
          cpu: 0,
          memory: 0,
          essential: true
        }
      ]
    }

    const updatedTaskDefPath = await addSidecar(taskDefPath, otelContainerDef)

    // Set outputs for other workflow steps to use
    core.setOutput('task-definition', updatedTaskDefPath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
