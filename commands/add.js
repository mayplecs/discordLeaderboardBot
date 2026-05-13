const { SlashCommandBuilder } = require("discord.js");
const { load, save, hasModRole } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a user to the leaderboard (Moderator only)")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User to add").setRequired(true)
    ),

  async execute(interaction) {
    if (!hasModRole(interaction.member)) {
      return interaction.reply({ content: "❌ You need the **Moderator** role to use this.", ephemeral: true });
    }

    const target = interaction.options.getUser("user");
    const lb = load();

    if (lb.find(e => e.id === target.id)) {
      return interaction.reply({ content: `⚠️ ${target.username} is already on the leaderboard.`, ephemeral: true });
    }

    lb.push({ id: target.id, name: target.username });
    save(lb);

    await interaction.reply(`✅ Added **${target.username}** to the leaderboard at position #${lb.length}.`);
  }
};
