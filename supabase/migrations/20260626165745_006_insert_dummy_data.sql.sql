-- Insert dummy data for testing

-- Notices
INSERT INTO cms_notices (id, title_np, title_en, content_np, content_en, category, priority, status, is_pinned, is_featured, publish_date) VALUES
(gen_random_uuid(), 'वार्षिक परीक्षा २०८२ को समयतालिका', 'Annual Examination Schedule 2082', 
 'प्रिय विद्यार्थीहरू, वार्षिक परीक्षा २०८२ आषाढ महिनाको पहिलो सप्ताहबाट सुरु हुनेछ। सम्पूर्ण समयतालिका गुरुकुलको सूचना पाटीमा प्रकाशित गरिएको छ।',
 'Dear Students, Annual Examination 2082 will commence from the first week of Ashadh. The complete schedule has been published on the notice board.',
 'exam', 'high', 'published', true, true, CURRENT_DATE),

(gen_random_uuid(), 'गुरु पूर्णिमा उत्सव', 'Guru Purnima Festival',
 'आषाढ शुक्ल पूर्णिमाको दिन गुरु पूर्णिमा मनाइनेछ। सबै विद्यार्थीहरू गुरुजनहरूको पूजा-अर्चनामा सहभागी हुन अनुरोध गरिन्छ।',
 'Guru Purnima will be celebrated on Ashadh Shukla Purnima. All students are requested to participate in the Guru Puja.',
 'festival', 'normal', 'published', false, true, CURRENT_DATE - INTERVAL '2 days'),

(gen_random_uuid(), 'शिक्षा निर्देशकको भ्रमण', 'Education Director Visit',
 'मधेश प्रदेशका शिक्षा निर्देशक महोदय आगामी मंसिरमा गुरुकुलको निरीक्षणमा आउने छन्। सबै शिक्षक र विद्यार्थीहरू तैयारी गर्न सचेत रहनुहोस्।',
 'Education Director of Madhesh Province will visit Gurukul for inspection in upcoming Mangsir. All teachers and students are advised to prepare accordingly.',
 'general', 'normal', 'published', false, false, CURRENT_DATE - INTERVAL '5 days'),

(gen_random_uuid(), 'विदा सूचना', 'Holiday Notice',
 'आषाढ महिनाको १५ गते अष्टमीको अवसरमा गुरुकुल विदा रहनेछ। सबै विद्यार्थीहरू १६ गते गुरुकुलमा उपस्थित हुनुहोस्।',
 'Gurukul will remain closed on 15th Ashadh due to Ashtami. All students are requested to attend on 16th.',
 'holiday', 'low', 'published', false, false, CURRENT_DATE - INTERVAL '7 days');

-- Events
INSERT INTO cms_events (id, title_np, title_en, description_np, description_en, event_date, event_time, location_np, category, status, is_featured) VALUES
(gen_random_uuid(), 'वर्षा यज्ञ', 'Varsha Yajna', 
 'प्रत्येक वर्ष जेठ महिनामा हुने वर्षा यज्ञ विशेष अनुष्ठान। सबै आश्रमवासीहरूको सहभागिता अपेक्षित छ।',
 'Special Varsha Yajna ceremony held every year in Jestha month. Participation of all ashram residents is expected.',
 CURRENT_DATE + INTERVAL '10 days', '06:00', 'यज्ञ शाला', 'ceremony', 'published', true),

(gen_random_uuid(), 'वेद पाठ प्रतियोगिता', 'Veda Path Competition',
 'वेद पाठ प्रतियोगितामा सहभागी हुन चाहने विद्यार्थीहरूले आफ्नो नाम दर्ता गराउनुहोस्।',
 'Students wishing to participate in Veda recitation competition should register their names.',
 CURRENT_DATE + INTERVAL '20 days', '10:00', 'सभा कक्ष', 'academic', 'published', true),

(gen_random_uuid(), 'श्रीमद्भगवद्गीता जयन्ती', 'Shrimad Bhagavad Gita Jayanti',
 'मार्गशीर्ष शुक्ल एकादशीको दिन गीता जयन्ती मनाइनेछ। विशेष पूजा र प्रवचन कार्यक्रम रहनेछ।',
 'Gita Jayanti will be celebrated on Margashirsha Shukla Ekadashi. Special puja and discourse programs will be held.',
 CURRENT_DATE + INTERVAL '30 days', '05:00', 'मन्दिर प्रांगण', 'festival', 'published', false),

(gen_random_uuid(), 'क्रीडा सप्ताह', 'Sports Week',
 'मंसिर महिनामा क्रीडा सप्ताह आयोजना हुनेछ। विभिन्न खेलहरूमा प्रतिस्पर्धा हुनेछ।',
 'Sports Week will be organized in Mangsir month. Various sports competitions will be held.',
 CURRENT_DATE + INTERVAL '45 days', '08:00', 'खेल मैदान', 'sports', 'published', false);

-- Albums
INSERT INTO cms_albums (id, title_np, title_en, description_np, photos_count, status) VALUES
(gen_random_uuid(), 'गुरु पूर्णिमा २०८१', 'Guru Purnima 2081', 'गुरु पूर्णिमा उत्सवका फोटोहरू', 12, 'published'),
(gen_random_uuid(), 'वार्षिकोत्सव २०८१', 'Annual Day 2081', 'वार्षिकोत्सव कार्यक्रमका फोटोहरू', 24, 'published'),
(gen_random_uuid(), 'यज्ञ अनुष्ठान', 'Yajna Ceremony', 'विभिन्न यज्ञ अनुष्ठानका फोटोहरू', 18, 'published'),
(gen_random_uuid(), 'मन्दिर परिसर', 'Temple Campus', 'गुरुकुल मन्दिर परिसरका फोटोहरू', 15, 'published');

-- Videos
INSERT INTO cms_videos (id, title_np, title_en, video_url, video_type, thumbnail_url, is_featured, status) VALUES
(gen_random_uuid(), 'गुरुकुलको इतिहास', 'History of Gurukul', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', true, 'published'),
(gen_random_uuid(), 'वेद पाठ', 'Veda Recitation', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'youtube', 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', true, 'published'),
(gen_random_uuid(), 'संस्कृत दिवस २०८१', 'Sanskrit Day 2081', 'https://www.youtube.com/watch?v=9bZkp7q19f0', 'youtube', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', false, 'published');

-- Sample photos for albums (using placeholder URLs)
INSERT INTO cms_photos (album_id, image_url, caption_np)
SELECT 
  a.id,
  'https://images.pexels.com/photos/164246/pexels-photo-164246.jpeg?auto=compress&cs=tinysrgb&w=600',
  'गुरुकुल परिसर'
FROM cms_albums a 
WHERE a.title_np = 'मन्दिर परिसर'
LIMIT 1;

INSERT INTO cms_photos (album_id, image_url, caption_np)
SELECT 
  a.id,
  'https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=600',
  'पूजा अर्चना'
FROM cms_albums a 
WHERE a.title_np = 'गुरु पूर्णिमा २०८१'
LIMIT 1;

INSERT INTO cms_photos (album_id, image_url, caption_np)
SELECT 
  a.id,
  'https://images.pexels.com/photos/3881015/pexels-photo-3881015.jpeg?auto=compress&cs=tinysrgb&w=600',
  'विद्यार्थीहरू'
FROM cms_albums a 
WHERE a.title_np = 'वार्षिकोत्सव २०८१'
LIMIT 1;

INSERT INTO cms_photos (album_id, image_url, caption_np)
SELECT 
  a.id,
  'https://images.pexels.com/photos/1629781/pexels-photo-1629781.jpeg?auto=compress&cs=tinysrgb&w=600',
  'यज्ञ अग्नि'
FROM cms_albums a 
WHERE a.title_np = 'यज्ञ अनुष्ठान'
LIMIT 1;
