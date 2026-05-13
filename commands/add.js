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
    await interaction.deferReply();

    if (!hasModRole(interaction.member)) {
      return interaction.editReply("❌ You need the **Moderator** role to use this.");
    }

    const target = interaction.options.getUser("user");
    const lb = await load();

    if (lb.find(e => e.id === target.id)) {
      return interaction.editReply(`⚠️ ${target.username} is already on the leaderboard.`);
    }

    lb.push({ id: target.id, name: target.username });
    await save(lb);

    await interaction.editReply(`✅ Added **${target.username}** to the leaderboard at position #${lb.length}.`);
  }
};
