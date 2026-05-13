const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { load } = require("../utils/leaderboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the leaderboard"),

  async execute(interaction) {
    const lb = load();

    if (lb.length === 0) {
      return interaction.reply("The leaderboard is empty. Add users with `/add`.");
    }

    const medals = ["🥇", "🥈", "🥉"];
    const description = lb
      .map((entry, i) => `${medals[i] || `**#${i + 1}**`} <@${entry.id}> — ${entry.name}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard")
      .setDescription(description)
      .setColor(0xf5c518)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
