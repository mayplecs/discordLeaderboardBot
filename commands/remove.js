const { SlashCommandBuilder } = require("discord.js");
const { load, save, hasModRole } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a user from the leaderboard (Moderator only)")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User to remove").setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    if (!hasModRole(interaction.member)) {
      return interaction.editReply("❌ You need the **Moderator** role to use this.");
    }

    const target = interaction.options.getUser("user");
    const lb = await load();

    const idx = lb.findIndex(e => e.id === target.id);
    if (idx === -1) {
      return interaction.editReply(`⚠️ ${target.username} is not on the leaderboard.`);
    }

    lb.splice(idx, 1);
    await save(lb);

    await interaction.editReply(`✅ Removed **${target.username}** from the leaderboard.`);
  }
};
