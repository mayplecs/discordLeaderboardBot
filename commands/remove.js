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
    if (!hasModRole(interaction.member)) {
      return interaction.reply({ content: "❌ You need the **Moderator** role to use this.", ephemeral: true });
    }

    const target = interaction.options.getUser("user");
    const lb = load();

    const idx = lb.findIndex(e => e.id === target.id);
    if (idx === -1) {
      return interaction.reply({ content: `⚠️ ${target.username} is not on the leaderboard.`, ephemeral: true });
    }

    lb.splice(idx, 1);
    save(lb);

    await interaction.reply(`✅ Removed **${target.username}** from the leaderboard.`);
  }
};
