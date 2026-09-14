import type { SupportedLanguage, TranslationResult } from '../types';

interface PhraseDictionary {
  [key: string]: {
    translatedText: string;
    culturalNote: string;
  };
}

const DICTIONARY: Record<SupportedLanguage, PhraseDictionary> = {
  spanish: {
    default: {
      translatedText: 'Por favor, siga las instrucciones de seguridad y diríjase hacia las salidas señalizadas con calma.',
      culturalNote: 'En eventos multitudinarios, hablar con calma y gesticular señalando los carteles de salida genera tranquilidad inmediata.',
    },
    gate: {
      translatedText: 'Por favor, mantenga despejada la entrada. Utilice las puertas adyacentes para una entrada más rápida.',
      culturalNote: 'Acompañar la indicación con una señal visual hacia las puertas laterales agiliza el flujo de aficionados.',
    },
    concourse: {
      translatedText: 'Los servicios de este nivel están congestionados. Les recomendamos usar los del piso superior.',
      culturalNote: 'Indicar claramente el número de planta o escalera más cercana ayuda a orientar a los visitantes.',
    },
    weather: {
      translatedText: 'Hace calor. Recuerde hidratarse en los puntos de agua gratuitos ubicados en el anillo exterior.',
      culturalNote: 'Los puntos de hidratación son gratuitos en el estadio, destacarlo evita confusiones con puestos de pago.',
    },
  },
  french: {
    default: {
      translatedText: 'Veuillez suivre les consignes de sécurité et vous diriger calmement vers les portes indiquées.',
      culturalNote: 'Utiliser une intonation polie et claire pour guider les supporters francophones vers les couloirs latéraux.',
    },
    gate: {
      translatedText: 'Merci de dégager le passage devant cette porte. Des accès plus rapides sont ouverts à côté.',
      culturalNote: 'Indiquer la porte alternative spécifique (ex. Porte B) évite les hésitations devant les portiques.',
    },
    concourse: {
      translatedText: 'Forte affluence dans cette zone. Veuillez privilégier les installations du niveau 2.',
      culturalNote: 'Une orientation claire vers les escaliers roulants permet de désengorger la galerie rapidement.',
    },
    weather: {
      translatedText: 'Pensez à vous hydrater régulièrement aux points d’eau situés sur le parvis.',
      culturalNote: 'Rappeler que les fontaines sont en libre accès encourage les familles à s’y rendre.',
    },
  },
  arabic: {
    default: {
      translatedText: 'يرجى اتباع إرشادات السلامة والتوجه بهدوء نحو البوابات والممرات المحددة.',
      culturalNote: 'يُفضل استخدام نبرة هادئة ومحترمة وتوجيه العائلات أولاً نحو الممرات الأوسع لتجنب التزاحم.',
    },
    gate: {
      translatedText: 'يرجى إخلاء منطقة الدخول لتسهيل الحركة. البوابات المجاورة متاحة لدخول أسرع.',
      culturalNote: 'الإشارة باليد نحو البوابات الجانبية تساعد الزوار على فهم المسار البديل بسهولة.',
    },
    concourse: {
      translatedText: 'تشهد هذه المنطقة ازدحاماً حالياً. يُرجى التوجه إلى مرافق الطابق الثاني.',
      culturalNote: 'توجيه المشجعين بلباقة نحو المصاعد أو السلالم يقلل من الضغط على الممر الرئيسي.',
    },
    weather: {
      translatedText: 'الطقس دافئ اليوم. تتوفر نقاط مياه شرب مجانية في ساحة الملعب الخارجية.',
      culturalNote: 'التأكيد على توفر مياه الشرب المجانية يضمن راحة وسلامة الجماهير القادمة من الخارج.',
    },
  },
  hindi: {
    default: {
      translatedText: 'कृपया सुरक्षा निर्देशों का पालन करें और शांतिपूर्वक निर्धारित द्वारों की ओर बढ़ें।',
      culturalNote: 'विनम्रता से और स्पष्ट आवाज में हाथ के इशारे से रास्ता दिखाना बहुत मददगार साबित होता है।',
    },
    gate: {
      translatedText: 'कृपया प्रवेश द्वार के सामने भीड़ न लगाएं। तेजी से प्रवेश के लिए बगल वाले गेट का उपयोग करें।',
      culturalNote: 'बगल वाले गेट का नाम (जैसे गेट B) बोलकर बताने से कतारें जल्दी खाली होती हैं।',
    },
    concourse: {
      translatedText: 'इस क्षेत्र में अधिक भीड़ है। कृपया दूसरी मंजिल पर स्थित सुविधाओं का उपयोग करें।',
      culturalNote: 'एस्केलेटर और सीढ़ियों की दिशा दिखाकर दर्शकों को ऊपर की मंजिल पर भेजना आसान होता है।',
    },
    weather: {
      translatedText: 'कृपया बाहरी परिसर में उपलब्ध मुफ्त पेयजल केंद्रों से पानी पीते रहें।',
      culturalNote: 'स्टेडियम में मुफ्त पीने के पानी के बूथ लगे हैं, यह बताना परिवारों के लिए बहुत उपयोगी होता है।',
    },
  },
  portuguese: {
    default: {
      translatedText: 'Por favor, siga as instruções de segurança e dirija-se com calma aos portões sinalizados.',
      culturalNote: 'Torcedores brasileiros e portugueses respondem muito bem a instruções acolhedoras e diretas.',
    },
    gate: {
      translatedText: 'Mantenha o acesso ao portão livre. Utilize os portões laterais para entrada mais rápida.',
      culturalNote: 'Apontar para o portão alternativo com clareza reduz o tempo de espera nas catracas.',
    },
    concourse: {
      translatedText: 'Muita movimentação neste setor. Recomendamos utilizar os banheiros no nível superior.',
      culturalNote: 'Informar que o nível 2 tem menor fila evita aglomerações no corredor térreo.',
    },
    weather: {
      translatedText: 'Dia quente! Lembre-se de beber água nos pontos de hidratação gratuitos no estádio.',
      culturalNote: 'Destacar que a água é gratuita incentiva todos a se manterem hidratados.',
    },
  },
  german: {
    default: {
      translatedText: 'Bitte folgen Sie den Sicherheitsanweisungen und begeben Sie sich ruhig zu den markierten Toren.',
      culturalNote: 'Präzise, klare Richtungsangaben und die Nennung konkreter Torausgänge werden geschätzt.',
    },
    gate: {
      translatedText: 'Bitte halten Sie den Eingangsbereich frei. Die Nebentore bieten einen schnelleren Einlass.',
      culturalNote: 'Konkrete Nennung des Ausweichtors (z. B. Tor B) beschleunigt die Entzerrung der Warteschlange.',
    },
    concourse: {
      translatedText: 'Hohes Besucheraufkommen in diesem Bereich. Bitte nutzen Sie die Einrichtungen auf Ebene 2.',
      culturalNote: 'Ein direkter Verweis auf die Rolltreppen führt zu einer schnellen Entlastung des Durchgangs.',
    },
    weather: {
      translatedText: 'Trinken Sie ausreichend Wasser. Kostenlose Wasserstationen stehen auf dem Außengelände bereit.',
      culturalNote: 'Der Hinweis auf kostenlose Trinkstationen sorgt für einen reibungslosen Ablauf.',
    },
  },
  japanese: {
    default: {
      translatedText: '安全に関する指示に従い、落ち着いて指定されたゲートへお進みください。',
      culturalNote: '丁寧なお辞儀やジェスチャーとともに案内することで、非常にスムーズに誘導できます。',
    },
    gate: {
      translatedText: '入場ゲート付近の通路確保にご協力ください。隣接ゲートの方がスムーズにご入場いただけます。',
      culturalNote: '隣の空いているゲートへの手招き案内が最も効果的です。',
    },
    concourse: {
      translatedText: '現在このフロアは混雑しております。2階コンコースの設備もご利用ください。',
      culturalNote: 'エスカレーターの位置を指し示して案内すると安心して移動していただけます。',
    },
    weather: {
      translatedText: '本日は気温が高くなっております。場内の無料給水所をご利用の上、こまめな水分補給をお願いします。',
      culturalNote: '無料の給水所（ウォーターステーション）の位置を案内すると大変親切です。',
    },
  },
  mandarin: {
    default: {
      translatedText: '请听从安保人员指引，保持秩序，有序前往指定出入口。',
      culturalNote: '清晰、温和的声音并辅以指向路标的手势，能够让球迷迅速理解并配合。',
    },
    gate: {
      translatedText: '请保持入场通道通畅。建议前往相邻闸口入场，通行速度更快。',
      culturalNote: '指明具体备用通道（如B门）可有效分散主闸口的排队人流。',
    },
    concourse: {
      translatedText: '该区域人流较密集，建议前往二层通道使用相关便民设施。',
      culturalNote: '引导球迷使用扶梯前往人流较少的楼层，能有效平衡场馆负荷。',
    },
    weather: {
      translatedText: '天气炎热，请前往外环走廊的免费饮水点及时补充水分。',
      culturalNote: '告知直饮水点为免费提供，方便各国游客安心使用。',
    },
  },
};

/**
 * Deterministic translation engine with authentic multi-language translations and cultural notes
 */
export function getTranslatedAlert(
  text: string,
  lang: SupportedLanguage,
  nativeName: string,
  langLabel: string
): TranslationResult {
  const langDict = DICTIONARY[lang] || DICTIONARY.spanish;
  const lower = text.toLowerCase();

  let entry = langDict.default;
  if (lower.includes('gate') || lower.includes('entry') || lower.includes('congestion') || lower.includes('turnstile')) {
    entry = langDict.gate;
  } else if (lower.includes('facility') || lower.includes('restroom') || lower.includes('concourse') || lower.includes('concession')) {
    entry = langDict.concourse;
  } else if (lower.includes('weather') || lower.includes('temperature') || lower.includes('hot') || lower.includes('water')) {
    entry = langDict.weather;
  }

  return {
    language: lang,
    languageLabel: langLabel,
    originalText: text,
    translatedText: entry.translatedText,
    culturalNote: entry.culturalNote,
    generatedAt: new Date().toISOString(),
  };
}
