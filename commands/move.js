const { SlashCommandBuilder } = require("discord.js");
const { load, save, hasModRole } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a user to a specific rank (Moderator only)")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User to move").setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("position").setDescription("New rank (1 = top)").setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    if (!hasModRole(interaction.member)) {
      return interaction.reply({ content: "❌ You need the **Moderator** role to use this.", ephemeral: true });
    }

    const target = interaction.options.getUser("user");
    const pos = interaction.options.getInteger("position");
    const lb = await load();

    const idx = lb.findIndex(e => e.id === target.id);
    if (idx === -1) {
      return interaction.reply({ content: `⚠️ ${target.username} is not on the leaderboard.`, ephemeral: true });
    }

    const clampedPos = Math.min(pos, lb.length);
    const [entry] = lb.splice(idx, 1);
    lb.splice(clampedPos - 1, 0, entry);
    await save(lb);

    await interaction.reply(`✅ Moved **${target.username}** to rank #${clampedPos}.`);
  }
};
