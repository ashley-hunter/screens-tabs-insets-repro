import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';

// SafeAreaView applies the inset as its own margin, so an empty one has height 0.
// Its auto-height parent measures that margin, which is the bottom inset it was given.
function Probe({ name, color, onHeight }: { name: string; color: string; onHeight: (h: number) => void }) {
  return (
    <View
      style={[styles.probe, { backgroundColor: color }]}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        console.log(`[repro] ${name} inset ${h.toFixed(2)}`);
        onHeight(h);
      }}
    >
      <SafeAreaView edges={{ bottom: true }} style={{ flex: 0 }} />
    </View>
  );
}

export default function App() {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [showSecond, setShowSecond] = useState(true);
  const [firstKey, setFirstKey] = useState(0);
  const [barHidden, setBarHidden] = useState(false);

  useEffect(() => console.log('[repro] App mounted'), []);

  return (
    <Tabs.Host navStateRequest={{ selectedScreenKey: 'one', baseProvenance: 0 }} tabBarHidden={barHidden}>
      <Tabs.Screen screenKey="one" title="One">
        <View style={styles.page}>
          <Text style={styles.value}>first {first.toFixed(2)}</Text>
          <Text style={styles.value}>second {showSecond ? second.toFixed(2) : 'unmounted'}</Text>
          <Button title="Toggle second" onPress={() => setShowSecond((s) => !s)} />
          <Button title="Remount first" onPress={() => setFirstKey((k) => k + 1)} />
          <Button title="Toggle tab bar" onPress={() => setBarHidden((h) => !h)} />
          <View style={styles.row}>
            <Probe key={firstKey} name="first" color="tomato" onHeight={setFirst} />
            {showSecond && <Probe name="second" color="dodgerblue" onHeight={setSecond} />}
          </View>
        </View>
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, gap: 16, padding: 24, paddingTop: 200, backgroundColor: 'white' },
  value: { fontSize: 28, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  probe: { flex: 1 },
});
