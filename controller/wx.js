module.exports = {
  share: async (ctx) => {
    await ctx.render("./index", {title: "chunyu欢迎您"});
  }
}