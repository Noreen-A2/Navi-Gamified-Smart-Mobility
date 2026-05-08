insert into
    public.regions (name, rarity, unlock_xp, boundary)
values
    (
        'Marina District',
        'rare',
        120,
        ST_GeogFromText (
            'POLYGON((28.975 31.0035, 28.985 31.009, 29.001 31.0015, 28.992 30.9955, 28.975 31.0035))'
        )
    ),
    (
        'Old Town',
        'common',
        80,
        ST_GeogFromText (
            'POLYGON((28.955 30.998, 28.962 31.005, 28.974 30.998, 28.967 30.991, 28.955 30.998))'
        )
    );

insert into
    public.quests (
        title,
        description,
        reward_xp,
        quest_type,
        rarity,
        location
    )
values
    (
        'Visit Marina District',
        'Walk the waterfront and unlock the marina gates.',
        120,
        'visit',
        'rare',
        ST_GeogFromText ('POINT(28.986 31.0048)')
    ),
    (
        'Ride Bus Route 4',
        'Hop on Bus 402 and ride 3 stops.',
        80,
        'ride',
        'common',
        ST_GeogFromText ('POINT(28.968 31.0008)')
    );

insert into
    public.businesses (name, category, rewards, sponsor_level, location)
values
    (
        'Nitro Coffee Hub',
        'Cafe',
        '15% discount + hidden marker clue',
        'partner',
        ST_GeogFromText ('POINT(28.982 31.0062)')
    );