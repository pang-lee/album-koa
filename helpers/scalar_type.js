const { GraphQLScalarType } = require('graphql')

module.exports = {
  photoFilter:  new GraphQLScalarType({
      name: 'photoFilter',
      description: 'photo filter custom scalar type',
      grayscale(value){
        return value
      },
      sepia(value){
        return value
      },
      saturate(value){
        return value
      },
      hueRotate(value){
        return value
      },
      invert(value){
        return value
      },
      brightness(value){
        return value
      },
      contrast(value){
        return value
      },
      blur(value){
        return value
      },
      suffix(){
        return {
          hueRotate: String,
          blur: String
        }
      }
    }),
  bookOption: new GraphQLScalarType({
      name: 'bookOption',
      description: 'photo option custom scalar type',
      title(value){
        return value
      },
      href(value){
        return value
      }
  })
}