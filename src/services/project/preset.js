import createPresetModel from 'models/preset'
import createProjectModel from 'models/project'

const DEFAULT_PARAMETERS = {
  'image/jpeg': {
    progressive: true,
    quality: 90
  },
  'image/gif': {
    optimize: '-O1'
  },
  'image/png': {
    minQuality: 65,
    maxQuality: 80,
    speed: 3
  },
  'image/svg+xml': {
    cleanupAttrs: true,
    inlineStyles: false,
    removeDoctype: false,
    removeXMLProcInst: false,
    removeComments: true,
    removeEmptyAttrs: false,
    removeHiddenElems: false,
    removeEmptyText: true,
    removeEmptyContainers: true,
    minifyStyles: true,
    convertColors: true,
    convertPathData: true,
    convertTransform: true,
    removeUnknownsAndDefaults: true,
    removeUselessStrokeAndFill: true,
    cleanupNumericValues: true,
    collapseGroups: true,
    mergePaths: true,
    removeNonInheritableGroupAttrs: true,
    cleanupIDs: true,
    removeStyleElement: true
  }
}

const create = async (projectIdentifier, data) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project) {
    return null
  }

  const Preset = await createPresetModel()

  const existed = await Preset.findOne({
    project: project._id,
    contentType: data.contentType
  })

  if (existed) {
    return null
  }

  const preset = await new Preset({
    project: project._id,
    contentType: data.contentType,
    isActive: true,
    parameters: DEFAULT_PARAMETERS[ data.contentType ]
  }).save()

  return preset
}

const del = async (projectIdentifier, contentType) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project) {
    return null
  }

  const Preset = await createPresetModel()

  const { n, ok } = await Preset.remove({
    project: project._id,
    contentType
  })

  return ok && n === 1
}

const get = async (projectIdentifier, contentType) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project) {
    return null
  }

  const Preset = await createPresetModel()

  const preset = await Preset.findOne({
    project: project._id,
    contentType
  })

  return preset
}

const list = async (projectIdentifier) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project) {
    return null
  }

  const Preset = await createPresetModel()

  const presets = await Preset.find({
    project: project._id
  })

  return presets
}

const replace = async (projectIdentifier, contentType, data) => {
  const Project = await createProjectModel()

  const project = await Project.findOne({
    identifier: projectIdentifier
  })

  if (!project) {
    return null
  }

  const Preset = await createPresetModel()

  const preset = await Preset.findOneAndUpdate({
    project: project._id,
    contentType
  }, data, {
    new: true
  })

  return preset
}

export default {
  create,
  del,
  get,
  list,
  replace
}
