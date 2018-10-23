  const clock = new Clock();
  const clock1 = new Clock1();
  const help = new Help();
  const influencers = { History: History, DuckDuckGo: DuckDuckGo };

  const suggester = new Suggester(
    CONFIG.influencers.map(i => new influencers[i.name](i.limit))
  );

  const parser = new QueryParser();
  const form = new Form(help, suggester, parser);
