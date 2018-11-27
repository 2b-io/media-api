import { FORBIDDEN, OK } from 'http-status-codes'
import joi from 'joi'

import resource from 'rest/resource'
import projectService from 'services/project'

const SCHEMA = joi.object().keys({
  isActive: joi.boolean().required(),
  parameters: joi.alternatives().try([
    joi.object().keys({
      progressive: joi.boolean().required(),
      quality: joi.number().min(0).max(100).required()
    }),
    joi.object().keys({
      optimize: joi.valid([
        '-O1',
        '-O2',
        '-O3'
      ]).required()
    }),
    joi.object().keys({
      minQuality: joi.number().min(0).max(joi.ref('maxQuality')).required(),
      maxQuality: joi.number().min(joi.ref('minQuality')).max(100).required(),
      speed: joi.number().min(1).max(10).required()
    }),
    joi.object().keys({
      cleanupAttrs: joi.boolean().required(),
      inlineStyles: joi.boolean().required(),
      removeDoctype: joi.boolean().required(),
      removeXMLProcInst: joi.boolean().required(),
      removeComments: joi.boolean().required(),
      removeEmptyAttrs: joi.boolean().required(),
      removeHiddenElems: joi.boolean().required(),
      removeEmptyText: joi.boolean().required(),
      removeEmptyContainers: joi.boolean().required(),
      minifyStyles: joi.boolean().required(),
      convertColors: joi.boolean().required(),
      convertPathData: joi.boolean().required(),
      convertTransform: joi.boolean().required(),
      removeUnknownsAndDefaults: joi.boolean().required(),
      removeUselessStrokeAndFill: joi.boolean().required(),
      cleanupNumericValues: joi.boolean().required(),
      collapseGroups: joi.boolean().required(),
      mergePaths: joi.boolean().required(),
      removeNonInheritableGroupAttrs: joi.boolean().required(),
      cleanupIDs: joi.boolean().required(),
      removeStyleElement: joi.boolean().required()
    })
  ]).required()
})

export default resource('PRESET')(
  async (req) => {
    const {
      contentType,
      projectIdentifier
    } = req.pathParameters
    const body = JSON.parse(req.body)

    const values = await joi.validate(body, SCHEMA)

    const preset = await projectService.preset.replace(projectIdentifier, contentType.replace('_', '/'), values)

    if (!preset) {
      throw {
        statusCode: FORBIDDEN
      }
    }

    return {
      statusCode: OK,
      resource: preset
    }
  }
)
